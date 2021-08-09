"use strict"

function builder(options)
{
	this.renderTo = options.renderTo || document.getElementById('app');
	this.className = options.className || null;
	this.columns = options.columns || null;
	this.items = options.items || null;
	this.container = null;
}

builder.prototype = {
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
		let columnArrayItems = [];
		for (let i = 0; i < this.items.length; i++) {
			let columnItem = this.items[i];

			if (columnItem.columnId === columnId)
			{
				columnArrayItems.push(columnItem);
			}
		}

		return columnArrayItems;
	},


	render: function ()
	{
		for (let i = 0; i < this.columns.length; i++) {
			let columnElement = this.columns[i];

			columnElement = new builderColumn({
				columnId: columnElement.id,
				columnTitle: columnElement.name,
				columnItems: this.getArrayItems(columnElement.id),
			});

			this.getContainer().appendChild(columnElement.render());
		}

		this.renderTo.appendChild(this.getContainer());
	},
}





function builderColumn(options)
{
	this.id = options.columnId || null;
	this.title = options.columnTitle || null;
	this.items = options.columnItems || null;
	this.columnNode = null;
	this.titleNode = null;

	this.itemsNode = null;
	this.formNode = null;
	this.inputNode = null;
	this.buttonNode = null;
}

builderColumn.prototype = {
	getForm: function ()
	{
		if (!this.formNode)
		{
			this.formNode = document.createElement('form');
			this.formNode.className = `notes--form`;
			if (!this.inputNode)
			{
				this.inputNode = document.createElement('input');
				this.inputNode.className = 'notes--input';
				this.formNode.appendChild(this.inputNode);
			}
			if (!this.buttonNode)
			{
				this.buttonNode = document.createElement('button');
				this.buttonNode.className = 'notes--button';
				this.buttonNode.innerText = 'Добавить';

				if (this.id)
				{
					this.buttonNode.setAttribute('data-column-id', this.id);
				}
			}

			this.formNode.appendChild(this.buttonNode);
			this.columnNode.appendChild(this.formNode);
		}
	},

	getItems: function ()
	{
		if (!this.itemsNode)
		{
			this.itemsNode = document.createElement('div');
			this.itemsNode.className = `notes--list`;

			for (let i = 0; i < this.items.length; i++) {
				let itemElement = this.items[i];

				itemElement = new builderItem({
					itemId: itemElement.id,
					itemText: itemElement.text,
				});

				this.itemsNode.appendChild(itemElement.render());
			}

			this.columnNode.appendChild(this.itemsNode);
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

			this.getItems();
			this.getForm();
			return this.columnNode;
		}
	},

	render: function ()
	{
		return this.getColumn();
	}
}

function builderItem(options)
{
	this.itemId = options.itemId || null;
	this.itemText = options.itemText || null;
	this.itemNode = null;
	this.itemNodeText = null;
	this.itemCloseBtn = null;
	this.itemChangeBtn = null;
}

builderItem.prototype = {
	getItem: function ()
	{
		if (!this.itemNode)
		{
			this.itemNode = document.createElement('div');
			this.itemNode.className = 'notes--list-item';
			console.log(this.itemText);
			if (this.itemText)
			{
				this.itemNodeText = document.createElement('div');
				this.itemNodeText.className = 'notes--list-item__text';
				this.itemNodeText.innerText = this.itemText;
				this.itemNode.appendChild(this.itemNodeText);
			}
			if (!this.itemChangeBtn)
			{
				this.itemChangeBtn = document.createElement('div');
				this.itemChangeBtn.className = 'notes--list-item__change';
				this.itemChangeBtn.innerText = 'Изменить';
				this.itemChangeBtn.setAttribute('data-change', '');
				this.itemNode.appendChild(this.itemChangeBtn);
			}
			if (!this.itemCloseBtn)
			{
				this.itemCloseBtn = document.createElement('div');
				this.itemCloseBtn.className = 'notes--list-item__delete';
				this.itemCloseBtn.setAttribute('data-delete', '');
				this.itemNode.appendChild(this.itemCloseBtn);
			}

			return this.itemNode;
		}
	},

	render: function ()
	{
		return this.getItem();
	}
}




let Block = new builder({
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
			text: 'Text any again. Text',
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