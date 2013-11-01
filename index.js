angular.module('tree-item-for-angular',[])
	.factory('TreeItem', function(){
		function TreeItem(name, parent, id){
			this.name = name
			this.parent = parent
			this.id = id
			this.checked = (parent) ? parent.checked : false
			this.open = false
			this.checkedChildren = this.checked
			this.children = []
		}

		TreeItem.prototype.applyToAncestors = function(f){
			if(this.parent){
				f(this.parent)
				this.parent.applyToAncestors(f)
			}
		}

		TreeItem.prototype.applyToDescendants = function(f){
			this.children.forEach(function(child){
				f(child)
				child.applyToDescendants(f)
			}) 
		}

		TreeItem.prototype.applyToChildren = function(f){
			this.children.forEach(function(child){
				f(child)
			}) 
		}

		TreeItem.prototype.reset = function(){
			this.checked = false
			this.checkedChildren = false
		}

		TreeItem.prototype.init = function(){
			this.loadChildren()
			this.open = true
		}

		TreeItem.prototype.check = function(treeItems){
			if(this.checked){
				this.reset()
				this.parent.checked = false


				if(!this.checkedChildren) this.applyToDescendants(function(e){
					e.checked = false
					e.checkedChildren = false
				})

				this.applyToAncestors(function(e){
					e.checked = false
					if(e.children.every(function(child){return !child.checked && !child.checkedChildren})){
						e.checkedChildren = false
					}
				})
			}
			else{
				this.checked = true
				this.checkedChildren = true

				this.applyToDescendants(function(e){
					e.checked = true
					e.checkedChildren = true
				})

				this.applyToAncestors(function(e){
					e.checkedChildren = true
					if(e.children.every(function(child){return child.checked})){
						e.checked = true
					}
				})
			}
		}

		TreeItem.prototype.addChild = function(name, id){
			if(objExistsInArrayByParam(name, this.children, 'name')){
				return this.getChild(name)
			}
			else{
				var child = new TreeItem(name, this, id)
				this.children.push(child)
				return child
			}			
		}

		TreeItem.prototype.getChild = function(name){
			return getObjInArrayByName(name, this.children)
		}

		TreeItem.prototype.toggleChildren = function(itemParent){
			if(this.open){
				this.open = false
				if(this.children.every(function(e){return !e.checked && !e.checkedChildren})){
					this.children = []
				}
			}
			else{
				if(this.children.length == 0) this.init()
				else this.open = true
			}

			if(itemParent) itemParent.unloadIdleChildren(this.name)
		}

		TreeItem.prototype.loadChildren = function(){
			this.addChild('Plato')
			this.addChild('Aristotle')
		}

		TreeItem.prototype.unloadIdleChildren = function(targetName){
			for(var x = 0; x < this.children.length; x++){
				if(this.children[x].name == targetName) continue
				if((!this.children[x].checked && !this.children[x].checkedChildren) && this.children[x].children.length > 0) this.children[x].reset()
			}
		}
		return TreeItem
	})

function objExistsInArrayByParam(param, array, paramName){
	for(var a = 0; a < array.length; a++){
		if(array[a][paramName] == param) return true
	}
	return false
}

function getObjInArrayByName(name, array){
	for(var a = 0; a < array.length; a++){
		if(array[a].name == name) return array[a]
	}	
}