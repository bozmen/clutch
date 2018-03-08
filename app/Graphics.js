class Graphics {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.objs = {};
    this.style_queue = {
      default: []
    };
  }

  // line: {id, x1, x2, y1, y2}
  drawLine(line, options) {
    const ctx = this.getContext();
    ctx.beginPath();
    const lineCx = (line.x1 + line.x2) / 2;
    const lineCy = (line.y1 + line.y2) / 2;
    if (options.rotate) {
      this.handleRotation(lineCx, lineCy)
    }
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  }

  /** line: { id : string,
              color : string,
              x1 : float,
              y1 : float,
              x2 : float,
              y2 : float }
   */
  drawLines(options, ...lines) {
    for (let i = 0; i < lines.length; i += 1) {
      this.drawLine(lines[i], options);
    }
  }

  /**
   *
   * @param {object} rect
   * @param {string} color
   * @param {number} rect.centerX
   * @param {number} rect.centerY
   * @param {number} rect.height
   * @param {number} rect.width
   */
  drawRect(rect, options) {
    options = options || {};
    let drawer = function() {
      const ctx = this.getContext();
      const startX = rect.centerX - (rect.width / 2);
      const startY = rect.centerY - (rect.height / 2);
      ctx.fillRect(startX, startY, rect.height, rect.width);
    };
    if (options.rotate) {
      drawer = this.drawRotated(rect.centerX, rect.centerY, options.rotate);
    }

    return drawer();
  }

  /**
   *
   * @param {object} circle
   * @param {string} color
   * @param {number} circle.centerX
   * @param {number} circle.centerY
   * @param {number} circle.radius
   */
  drawCircle(circle, options) {
    options = options || {};
    let drawer = function() {
      const ctx = this.getContext();
      ctx.beginPath();
      ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
      ctx.stroke();
    };

    if (options.rotate) {
      drawer = this.drawRotated(circle.centerX, circle.centerY, options.rotate)
    }

    return drawer();
  }

  getContext() {
    return this.ctx;
  }

  /**
   *
   * @param {string} color
   */
  setContextColor(color) {
    if (color) {
      this.ctx.strokeStyle = color;
    }
  }

  handleRotation(centerX, centerY, rotation) {
    const ctx = this.getContext();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.restore();
  }

  clearCanvas() {
    this.getContext().clearRect(0, 0, this.canvas.offsetHeight, this.canvas.offsetWidth);
  }

  drawRotated(centerX, centerY, rotation, drawerFunc) {
    return function() {
      const ctx = this.getContext();
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      drawerFunc();
      ctx.restore();
    }
  }

  drawAll() {

  }
}

export default Graphics;
