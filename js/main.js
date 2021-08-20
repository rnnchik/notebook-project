function Builder(options)
{
	this.renderTo = options.renderTo || null;
	this.className = options.className || null;
	this.columns = options.columns || null;
	this.items = options.items || null;
	this.container = null;
}

Builder.prototype = {
	getContainer: function ()
	{
		if(!this.container)
		{
			this.container = document.createElement('div');

			if (this.className)
			{
				this.container.className = this.className;
			}
		}

		return this.container;
	},

	getArrayItems: function (columnId)
	{
		var columnArrayItems = [];
		for (var i = 0; i < this.items.length; i++) {
			var columnItem = this.items[i];

			if (columnItem.columnId === columnId)
			{
				columnArrayItems.push(columnItem);
			}
		}

		return columnArrayItems;
	},

	getItems: function (id)
	{
		return this.items;
	},

	changeItemArray: function (id, text)
	{
		for (var i = 0; i < this.items.length; i++) {
			var items = this.items[i];
			if (items.id === id)
			{
				console.log(this.items);
				items.text = text;

				break;
			}
		}

		return this.items;
	},

	delItemArray: function (id)
	{
		for (var i = 0; i < this.items.length; i++) {
			var items = this.items[i];
			if (items.id === id)
			{
				this.items.splice([i], 1);

				console.log(this.items);
				break;
			}
		}

		return this.items;
	},

	render: function ()
	{
		if (this.renderTo)
		{
			for (var i = 0; i < this.columns.length; i++) {
				var columnElement = this.columns[i];

				columnElement = new BuilderColumn({
					builder: this,
					columnId: columnElement.id,
					columnTitle: columnElement.name,
					columnItems: this.getArrayItems(columnElement.id),
				});

				this.getContainer().appendChild(columnElement.render());
			}

			this.renderTo.appendChild(this.getContainer());
		}
	},
}



function BuilderColumn(options)
{
	this.id = options.columnId || null;
	this.title = options.columnTitle || null;
	this.items = options.columnItems || null;
	this.builder = options.builder;

	this.columnNode = null;
	this.titleNode = null;
	this.itemsNode = null;
	this.formNode = null;
	this.inputNode = null;
	this.buttonNode = null;
}

BuilderColumn.prototype = {
	getForm: function ()
	{
		if (!this.formNode)
		{
			this.formNode = document.createElement('div');
			this.formNode.className = `notes--form`;
			if (!this.inputNode)
			{
				this.inputNode = document.createElement('input');
				this.inputNode.className = 'notes--input';
				this.formNode.appendChild(this.inputNode);
				this.inputNode.addEventListener('keydown', function(e) {
						if (e.keyCode === 13) {
							this.addItem();
						}
					}.bind(this));
			}
			if (!this.buttonNode)
			{
				this.buttonNode = document.createElement('button');
				this.buttonNode.className = 'notes--button';
				this.buttonNode.innerText = 'Добавить';
				console.log(this);
				// this.buttonNode.addEventListener('click', this.addItem.bind(this));
				this.buttonNode.addEventListener('click', function() {
					this.addItem();
				}.bind(this));

				if (this.id)
				{
					this.buttonNode.setAttribute('data-column-id', this.id);
				}
			}

			this.formNode.appendChild(this.buttonNode);
		}

		return this.formNode;
	},

	getItems: function ()
	{
		if (!this.itemsNode)
		{
			this.itemsNode = document.createElement('div');
			this.itemsNode.className = `notes--list`;

			for (var i = 0; i < this.items.length; i++) {
				var itemElement = this.items[i];

				itemElement = new BuilderItem({
					builder: this.builder,
					itemId: itemElement.id,
					itemText: itemElement.text,
				});

				this.itemsNode.appendChild(itemElement.render());
			}
		}

		return this.itemsNode;
	},

	addItem: function ()
	{
		if (this.inputNode.value !== '')
		{
			var itemId = '';
			if (this.builder.items.length > 0)
			{
				itemId = String(+this.builder.items[this.builder.items.length - 1].id + 1);
			}
			else
			{
				itemId = '0';
			}

			this.builder.getItems(this.id).push({
				id: itemId,
				text: this.inputNode.value,
				columnId: this.id
			});

			var itemElement = new BuilderItem({
				builder: this.builder,
				itemId: itemId,
				itemText: this.inputNode.value,
			});
			console.log(this.builder.items);

			this.inputNode.value = '';

			this.itemsNode.appendChild(itemElement.render());
		}
	},

	getColumn: function ()
	{
		if (!this.columnNode)
		{
			this.columnNode = document.createElement('div');
			this.columnNode.className = `notes--column`;

			if (this.id)
			{
				this.columnNode.setAttribute('data-column-id', this.id);
			}
			if (this.title)
			{
				this.titleNode = document.createElement('h2');
				this.titleNode.innerText = this.title;
				this.titleNode.className = 'notes--title';
				this.columnNode.appendChild(this.titleNode);
			}

			this.columnNode.appendChild(this.getItems());
			this.columnNode.appendChild(this.getForm());

			return this.columnNode;
		}
	},

	render: function ()
	{
		return this.getColumn();
	}
}

function BuilderItem(options)
{
	this.builder = options.builder;
	this.itemId = options.itemId || null;
	this.itemText = options.itemText || null;

	this.itemNode = null;
	this.itemNodeText = null;
	this.itemCloseBtn = null;
	this.itemChangeTextarea = null;
	this.itemChangeBtn = null;
}

BuilderItem.prototype = {
	getItem: function ()
	{
		if (!this.itemNode)
		{
			this.itemNode = document.createElement('div');
			this.itemNode.className = 'notes--list-item';
			this.itemNode.setAttribute('data-item-id', this.itemId);
			if (this.itemText)
			{
				this.itemNodeText = document.createElement('div');
				this.itemNodeText.className = 'notes--list-item__text';
				this.itemNodeText.innerText = this.itemText;
				this.itemNode.appendChild(this.itemNodeText);
			}
			if (!this.itemChangeTextarea)
			{
				this.itemChangeTextarea = document.createElement('textarea');
				this.itemChangeTextarea.className = 'notes--list-item__textarea';
				this.itemNode.appendChild(this.itemChangeTextarea);
				this.itemChangeTextarea.addEventListener('keydown', function(e) {
					if (e.keyCode === 13) {
						this.changeItem();
					}
				}.bind(this));
			}
			if (!this.itemChangeBtn)
			{
				this.itemChangeBtn = document.createElement('div');
				this.itemChangeBtn.className = 'notes--list-item__change';
				this.itemChangeBtn.innerText = 'Изменить';
				this.itemChangeBtn.setAttribute('data-change', 'change');
				this.itemChangeBtn.addEventListener('click', this.changeItem.bind(this));
				this.itemNode.appendChild(this.itemChangeBtn);
			}
			if (!this.itemCloseBtn)
			{
				this.itemCloseBtn = document.createElement('div');
				this.itemCloseBtn.className = 'notes--list-item__delete';
				this.itemCloseBtn.setAttribute('title', 'Удалить');
				this.itemCloseBtn.setAttribute('data-delete', '');
				this.itemCloseBtn.addEventListener('click', this.deleteItem.bind(this));
				this.itemNode.appendChild(this.itemCloseBtn);

			}

			return this.itemNode;
		}
	},

	deleteItem: function ()
	{
		this.builder.delItemArray(this.itemNode.getAttribute('data-item-id'));
		this.itemNode.remove();
	},

	changeItem: function ()
	{
		if (this.itemChangeBtn.getAttribute('data-change') === 'change')
		{
			this.itemNodeText.style.display = 'none';
			this.itemChangeTextarea.innerText = this.itemText;
			this.itemChangeTextarea.style.display = 'block';
			this.itemChangeBtn.setAttribute('data-change', 'save');
			this.itemChangeBtn.innerText = 'Сохранить';
			this.itemChangeTextarea.focus();
		}
		else
		{
			this.itemNodeText.innerText = this.itemChangeTextarea.value;
			this.itemText = this.itemChangeTextarea.value;
			this.itemNodeText.style.display = 'block';
			this.itemChangeTextarea.style.display = 'none';
			this.itemChangeBtn.setAttribute('data-change', 'change');
			this.itemChangeBtn.innerText = 'Изменить';

			this.builder.changeItemArray(this.itemNode.getAttribute('data-item-id'), this.itemChangeTextarea.value);
		}
	},

	render: function ()
	{
		return this.getItem();
	}
}




























var Block = new Builder({
	renderTo: document.getElementById('app'),
	className: 'notes--container flex',
	columns: [
		{
			id: 'vyuvuyvyuv6g667',
			name: 'Че хорошо'
		},
		{
			id: 'j8j8',
			name: 'Че плохо'
		},
		{
			id: '3dd',
			name: 'Че надо'
		}
	],
	items: [
		{
			id: '1',
			text: 'Text any',
			columnId: 'j8j8'
		},
		{
			id: '2',
			text: 'Text any again',
			columnId: 'vyuvuyvyuv6g667'
		},
		{
			id: '3',
			text: 'Сайт рыбатекст поможет дизайнеру, верстальщику, вебмастеру сгенерировать несколько абзацев.',
			columnId: '3dd'

		},
		{
			id: '4',
			text: 'Text any again. Text any ',
			columnId: 'vyuvuyvyuv6g667'
		},
		{
			id: '5',
			text: 'Text any again. Text any again.',
			columnId: 'j8j8'
		}
	]
});

Block.render();