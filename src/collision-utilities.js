export const rectCollision = (obj1, obj2) => {
    return !(obj2.x > obj1.w + obj1.x || obj1.x > obj2.w + obj2.x || obj2.y > obj1.h + obj1.y || obj1.y > obj2.h + obj2.y);
}

// https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
export const rectCircleCollision = (circle,rect) => {
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}