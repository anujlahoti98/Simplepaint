window.addEventListener("load",()=>{
    var container = document.getElementById("mycanvas");
    var drawing = container.getContext("2d");
    drawing.lineWidth=10
    drawing.lineCap= "round"
    var painting = false
    var drag = false
    var initialX=-1, initialY=-1;
    var finalX=-1, finalY;
    var x3 = -1
    var downX,downY; 
    var firstClick = new Date().getTime() 
    var listOfTriangles=[]    
    var triangle
    var lastTriangleIndex
    
    function startDraw(e)
    {
        downX = e.clientX-rect.left;
        downY = e.clientY-rect.top;
        
        var result = isInside( downX,downY) 
        if(result!=null  )
        {
            lastTriangleIndex = result[1]
            triangle = result[0]
            initialX=triangle.x1
            initialY=triangle.y1
            finalX=triangle.x2
            finalY=triangle.y2
            x3=triangle.x3
            finalY=triangle.y3
            
            drag = true
        }
        else
        {
            
            initialX =downX
            initialY =downY
            painting = true  
            
        }        
        
    }
    
    function endDraw(value) {
        console.log(`end x:${value.clientX-rect.left} y:${value.clientY-rect.top}`)
        x3= initialX - (finalX-initialX)
        if(drag){
            drag = false
        }
        
        else if (painting){
            painting = false
            console.log(`${initialX} ${initialY} ${finalX} ${finalY}`)
            if(initialX>=0 && finalX>=0 && initialY>=0 && finalY>=0){      
                var newTriangle = {
                    "x1":initialX,
                    "x2":finalX,
                    "x3":x3,
                    "y1":initialY,
                    "y2":finalY,
                    "y3":finalY
                }
                listOfTriangles.push(newTriangle)
                console.log(listOfTriangles)
                drawTriangle(newTriangle,true)  
            }     
        }
    
        var t2 = new Date().getTime()
        if(t2-firstClick<400)
        {
            clearTriangle(lastTriangleIndex)
            reset()
        }
        firstClick=t2
        
    }
    
    
    
    
    
    function drawTriangle(triangle, resetFlag){
        drawing.beginPath()
        
        drawing.moveTo(triangle.x1,triangle.y1)   
        drawing.lineTo(triangle.x2,triangle.y2)  
        
        
        drawing.lineTo(triangle.x3, triangle.y3)
        
        drawing.lineTo(triangle.x1, triangle.y1)
        drawing.fillStyle = "blue";
        
        drawing.fill()
        
        if(resetFlag)
        reset()
        
    }
    
    function reset()
    {
        initialX=-1, initialY=-1;
        finalX=-1, finalY=-1;
        x3 = -1
        downX=-1,downY=-1;
        triangle = null
    }
    
    function clearTriangle(index)
    {   
        console.log(index)
        try{
            listOfTriangles.splice(index,1)
            console.log(listOfTriangles)
            drawAllTrianglesOnCanvas(); 
        }catch(er){
            console.log(er) 
        }
    }
    
    function drawAllTrianglesOnCanvas(){
        drawing.clearRect(0,0,container.width,container.height)
        listOfTriangles.forEach((triangle, i)=>{
            console.log("drawing"+i)
            drawTriangle(triangle, false)
        })
    }
    
    var rect = container.getBoundingClientRect();
    function onMove(value)
    {
        var x  = value.clientX-rect.left
        var y = value.clientY-rect.top
        var deltaX = x-downX
        var deltaY = y-downY
        var coor = `initialX: ${initialX} intialY: ${initialY} deltax:${deltaX} deltay:${deltaY}`
        // console.log(coor)
        
        if(drag){
            triangle.x1 += deltaX
            triangle.y1 += deltaY
            triangle.x2 += deltaX
            triangle.y2 += deltaY
            triangle.x3 += deltaX
            triangle.y3 += deltaY
            initialX = triangle.x1
            initialY = triangle.y1
            finalX = triangle.x2
            finalY = triangle.y2
            x3 = triangle.x3
            downX=x;
            downY =y;
            drawAllTrianglesOnCanvas(triangle, false)
        }
        if(!painting) return
        finalX =value.clientX-rect.left
        finalY =  value.clientY-rect.top
        document.getElementById("demo").innerHTML = coor;
        
    }

    function area(x1, y1,x2,y2,x3,y3)
    {
        return Math.abs((x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2.0)
    }
    
    
    
    function isInside( x,y)
    {
        var triangleFound;
        console.log(listOfTriangles)

        for(let i=0;i<listOfTriangles.length;i++){
            var tri = listOfTriangles[i];
            console.log(tri)
            var a = area(tri.x1,tri.y1,tri.x2,tri.y2,tri.x3,tri.y3)
            var a1 = area(x,y,tri.x2,tri.y2,tri.x3,tri.y3)
            var a2 = area(tri.x1,tri.y1,x,y,tri.x3,tri.y3)
            var a3 = area(tri.x1, tri.y1,tri.x2,tri.y2,x,y)
            console.log("a "+a+" a1:"+a1+" a2:"+a2+" a3:"+a3)
            
            if(a==a1+a2+a3){
                console.log("triangle found "+i)
                return [tri, i]
            }
        }
        return null;
        
        
    }
    
    
    container.addEventListener("mousedown",startDraw)
    container.addEventListener("mouseup",endDraw)
    document.body.addEventListener("mousemove",onMove)
    
    var mybtn = document.getElementById("btn")
    mybtn.addEventListener("click",function()
    {
        drawing.clearRect(0,0,container.width,container.height)
        reset()
        listOfTriangles.splice(0,listOfTriangles.length)
    })
    
    
    
    
    
})








