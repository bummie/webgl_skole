function Node(object, parent)
{   
    this.Object = object;
    this.Parent = parent;
    this.Children = [];

    this.draw = function(gl, programInfo)
    {
        if(this.Children.length <= 0) 
        {
            this.Object.draw(this.Parent, gl, programInfo);
            return;
        }

        this.Children.forEach(function(node) 
		{
            node.draw(gl, programInfo);
		});	
    }
}