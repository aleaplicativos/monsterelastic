! function ()
{
	"use strict";
	var canvas = new ge1doot.Canvas();
	var ctx = canvas.ctx;
	var pointer = canvas.pointer;
	var joints = [];
	var param = {
		numFi  : 8,
		numPh  : 26,
		flex   : 2,
		shrink : 1,
		ease   : 60,
		image  : "https://i.cdn.turner.com/adultswim/big/img/2016/08/10/tentacleSegment.png",
		dim : {
			sx : 11,
			sy : 15,
			wi : 75,
			he : 30,
			ln : 61
		}
	}
	var Joint = function (parent, N, Ni)
	{
		var z       = 1 - Ni / (param.numPh * param.shrink);
		this.img    = param.image;
		this.x      = 0;
		this.y      = 0;
		this.flex   = Ni / param.flex;
		this.ease   = param.ease;
		this.sx     = param.dim.sx * z * zoom;
		this.sy     = param.dim.sy * z * zoom;
		this.wi     = param.dim.wi * z * zoom;
		this.he     = param.dim.he * z * zoom;
		this.px     = (N * this.he * 1.5) - (param.numFi * this.he * 1.5 / 2);
		this.lsx    = (param.dim.ln * z * zoom) - this.sx;
		this.ang    = -Math.PI / 2;
		this.cos    = 0;
		this.sin    = 0;
		this.parent = parent;
	}
	Joint.prototype.run = function()
	{  
		if (this.parent)
		{
			var p = this.parent;
			this.x = p.x + p.cos * p.lsx;
			this.y = p.y + p.sin * p.lsx;
		}
		else
		{
			this.x = canvas.width * 0.5 + this.px;
			this.y = canvas.height;
		}
		this.ang += (
			(
				-Math.PI / 2 + (
					-Math.PI / 2 + Math.atan2(
						canvas.height - pointer.y, 
						pointer.x - this.x
					)
				) * this.flex
			) - this.ang
		) / this.ease;
		var c = this.cos = Math.cos(this.ang);
		var s = this.sin = Math.sin(this.ang);
		ctx.setTransform(c, s, -s, c, this.x, this.y);
		ctx.drawImage(this.img, -this.sx, -this.sy, this.wi, this.he);
	}
	var run = function ()
	{
		requestAnimationFrame(run);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		for (var i = 0, n = joints.length; i < n; i++) {
			joints[i].run();
		}
		ctx.restore();
	}
	var zoom = Math.max(canvas.width, canvas.height) / 900;
	var img = new Image(), O;
	img.src = param.image;
	param.image = img;
	for (var i = 0; i < param.numFi ; i++)
	{
		O = null;
		for (var j = 0; j < param.numPh ; j++)
		{
			joints.push(
				O = new Joint(O, i, j)
			);
		}
	}
	pointer.x = canvas.width / 2;
	run();
}();