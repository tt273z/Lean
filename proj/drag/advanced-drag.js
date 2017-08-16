//获取随机颜色
function getRandomColor() {
    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
}

//拖拽函数
function setDrag(obj) {

    var oNear = null;

    obj.onmousedown = function(e){
        var l = e.clientX - obj.offsetLeft;
        var t = e.clientY - obj.offsetTop;

        document.onmousemove = function (e) {

            obj.style.zIndex = minIndex++;
            obj.style.left = e.clientX - l + 'px';
            obj.style.top = e.clientY - t + 'px';

            for (i = 0; i < len; i++) {
                aDiv[i].className = '';
            }
            //添加className 表示可交互状态
            oNear = findNearest(obj);
            if (oNear) {
                oNear.className = 'active';
            }
        };

        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
           
            //释放鼠标 存在最近距离对象时进行交换
            if (oNear) {
                //利用aPos数组中存储的位置信息进行交换
                startMove(obj, aPos[oNear.index]);
                startMove(oNear, aPos[obj.index]);
                oNear.className = '';
                
                //交换index
                obj.index += oNear.index;
                oNear.index = obj.index - oNear.index;
                obj.index -= oNear.index;
                
                //两者交换时保持层级最大
                oNear.style.zIndex = minIndex++;
                obj.style.zIndex = minIndex++;

            } else {
                //不存在则回到初始位置
                startMove(obj, aPos[obj.index]);
            }
        };
        clearInterval(obj.timer);
        return false;
    };
}

//碰撞检测 碰撞返回true
function crashTest(obj1, obj2) {
    var tLine1 = obj1.offsetTop;
    var rLine1 = obj1.offsetLeft + obj1.offsetWidth;
    var bLine1 = obj1.offsetTop + obj1.offsetHeight;
    var lLine1 = obj1.offsetLeft;

    var tLine2 = obj2.offsetTop;
    var rLine2 = obj2.offsetLeft + obj2.offsetWidth;
    var bLine2 = obj2.offsetTop + obj2.offsetHeight;
    var lLine2 = obj2.offsetLeft;

    if (rLine1 < lLine2 || bLine1 < tLine2 || lLine1 > rLine2 || tLine1 > bLine2) {
        return false;
    }
    return true;
}
//勾股定理获得直线距离
function getDistance(obj1, obj2) {
    var a = obj1.offsetLeft - obj2.offsetLeft;
    var b = obj1.offsetTop - obj2.offsetTop;
    return Math.sqrt(a * a + b * b);
}
//获得碰撞且有最近距离的对象
function findNearest(obj) {
    var min = 99999;
    var index = -1;
    for (i = 0; i < len; i++) {
        //当aDiv[i]为当前对象时跳过
        if (obj == aDiv[i])
            continue;
        //循环比较得到最小值和索引
        if (crashTest(obj, aDiv[i])) {
            var dis = getDistance(obj, aDiv[i]);
            if (dis < min) {
                min = dis;
                index = i;
            }
        }
    }
    if (index !== -1) {
        return aDiv[index];
    }
    return null;
}
