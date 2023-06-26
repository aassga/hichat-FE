export function cl() {
  let srcUrl = document.querySelector(".el-image-viewer__img").src;
  downloadImages(srcUrl, srcUrl);
}

export function checkImage(el) {//这个事件要绑定el-image父级盒子上
  console.log(el)
  console.log('点击事件');
  let a = document.querySelector('.el-image-viewer__actions__inner');
  let header = document.querySelector('.el-image-viewer__wrapper');
  //添加 div
  var div = document.createElement("div");
  //设置 div 属性，如 id
  div.setAttribute("class", "newDiv");
  const name = el.chatType === "SRV_USER_IMAGE" ? el.name : el.groupName
  div.innerHTML = `<div>${name}</div><div>${el.message.time}</div>`;
  header.appendChild(div);
  console.log(el)
  // $(a).append(`<i class="el-icon-download" onclick="installImage()"></i>`)
  // a.append( `<i class="el-icon-download" onclick="cl()"></i>`)
  console.log(a)
  let ff = document.createElement('i')
  console.log(ff)
  ff.innerHTML = `<i class="el-icon-download" onclick="cl()"></i>`
  a.appendChild(ff)
}
export function downloadImages(imgsrc, name) {
  //下载图片地址和图片名
  let image = new Image(); // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
}