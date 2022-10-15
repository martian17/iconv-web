let body = new ELEM(document.body);
body.style(`
height:100vh;
background-color:#222;
`);


let upbox = body.add("input","type:file");

let gmg = [];

upbox.on("input",async ()=>{
    if(gmg)gmg.map(e=>e.remove());
    let file = upbox.e.files[0];
    console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise(res=>reader.onload=res);
    let img = new Image();
    img.src = reader.result;
    gmg = [body.add(img)];
    await new Promise(res=>img.onload=res);
    let canvas = document.createElement("canvas");
    console.log(img.width);
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0);
    gmg.push(body.add(canvas));

    let jpgurl = canvas.toDataURL("image/jpeg");
    let a = document.createElement("a");
    gmg.push(body.add(a));
    a.href=jpgurl;
    a.download = file.name+".jpg";
    a.innerHTML = "download";
    a.click();
});



