function MidCirle(_canvas, options) {
  this.canvas = _canvas;
  this.ctx;
  this.dots;
  this.old_dots;

  var default_options = {
    colors: {
      line_color: "#000",
      dot_color: "#f00"
    },
    scale: 10,
    num_dots: 10
  };
  this.options = $.extend(default_options, options);

  if (this.canvas.getContext) {
    this.ctx = this.canvas.getContext("2d");

    this.dots = new Array(options.num_dots);
    this.canvas.width = $(window).width();
    this.canvas.height = $(window).height();
    // get some random dots
    for (var i = 0; i < options.num_dots; i++) {
      this.dots[i] = new this.Dot(randomInt(this.canvas.width), randomInt(this.canvas.height));
    }

    this.old_dots = [];
    this.draw(this.dots);
  }
}

MidCirle.prototype.Dot = function(x, y) {
  this.x = x;
  this.y = y;
};

MidCirle.prototype.findMidpoints = function(dots) {
  var last_dot;
  var new_dots = new Array(dots.length);
  for (i = 0; i < dots.length; i++) {
    last_dot = dots[i >= 1 ? i - 1 : dots.length - 1];
    new_dots[i] = new this.Dot((dots[i].x + last_dot.x) / 2, (dots[i].y + last_dot.y) / 2);
  }
  return new_dots;
};

MidCirle.prototype.iterate = function() {
  this.old_dots.push(this.dots);
  this.dots = this.findMidpoints(this.dots);
  this.draw();
};

MidCirle.prototype.draw = function() {
  this.clear();
  var grey = 100 / (this.old_dots.length + 1);
  for (var i = 0; i < this.old_dots.length; i++) {
    this.ctx.strokeStyle = this.greyFromPercent(grey * (this.old_dots.length - i));
    this.circle(this.old_dots[i]);
  }
  this.ctx.strokeStyle = this.options.colors.line_color;
  this.ctx.fillStyle = this.options.colors.dot_color;
  this.circle(this.dots, true);
};

MidCirle.prototype.circle = function(dots, showdots){
  var last_dot;
  for (i = 0; i < dots.length; i++) {
    last_dot = dots[i >= 1 ? i - 1 : dots.length - 1];
    this.line(dots[i].x, dots[i].y, last_dot.x, last_dot.y);
  }
  if (showdots) {
    for (i = 0; i < dots.length; i++) {
      last_dot = dots[i >= 1 ? i - 1 : dots.length - 1];
      this.ctx.fillRect(dots[i].x - (this.options.scale / 2), dots[i].y - (this.options.scale / 2), this.options.scale, this.options.scale);
    }
  }
};

MidCirle.prototype.line = function(x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.lineCap = 'round';
  this.ctx.lineWidth = 2;
  this.ctx.moveTo(x1 + 1, y1 + 1);
  this.ctx.lineTo(x2 + 1, y2 + 1);
  this.ctx.stroke();
};

MidCirle.prototype.clear = function() {
  this.canvas.width = $(window).width();
};

MidCirle.prototype.greyFromPercent = function(percent) {
  var grey = Math.floor(percent * 255 / 100);
  return 'rgb('+grey+','+grey+','+grey+')';
};

var randomInt = function(x) {
  return Math.floor(Math.random() * x);
};
