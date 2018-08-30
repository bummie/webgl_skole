function IOHandler()
{
    let xhttp = new XMLHttpRequest();

    this.loadFile = function()
    {
       fetch('./models/Armadillo.obj')
       .then(response => response.text())
       .then(text => console.log(text));
    }
}