class WaterFlowLayout {
  constructor({ selector, imgWidth = 200, debounceDt = 500, list }) {
    this.waterFlow = document.querySelector(selector);
    this.imgWidth = imgWidth;
    this.debounceDt = debounceDt;
    this.createImgs(list);
    this.debounce(debounceDt);
  }

  /**
   * 初始化列表
   */
  createImgs(list) {
    list.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.style.width = `${this.imgWidth}px`;
      waterFlow.appendChild(img);
      img.onload = () => {
        this.setPositions();
      };
    });
  }

  /**
   * 设置位置
   */
  setPositions() {
    const { columns, space } = this.calcColOrSpace();

    // 数组里面保存每一列的高度
    const arr = new Array(columns).fill(0);
    [...this.waterFlow.children].forEach((img) => {
      // top
      const minTop = Math.min(...arr);
      img.style.top = `${minTop}px`;

      // 改变当前列的高度
      // 得到当前最小列的索引
      const index = arr.indexOf(minTop);
      arr[index] += img.clientHeight + space;

      // left
      const left = (index + 1) * space + index * this.imgWidth;
      img.style.left = `${left}px`;
    });

    const maxHeight = Math.max(...arr);
    this.waterFlow.style.height = maxHeight + 'px';
  }

  /**
   * 计算 间隙 和 列数
   */
  calcColOrSpace() {
    const waterFlowWidth = this.waterFlow.clientWidth;
    const columns = Math.floor(waterFlowWidth / this.imgWidth);
    const spaceNumber = columns + 1;
    const space = (waterFlowWidth - columns * this.imgWidth) / spaceNumber;
    return {
      space,
      columns
    };
  }

  // 视口改变防抖
  debounce(dt) {
    let timeId = null;
    window.onresize = () => {
      if (timeId) {
        clearTimeout(timeId);
        timeId = null;
      }
      timeId = setTimeout(() => {
        this.setPositions();
      }, dt);
    };
  }
}
