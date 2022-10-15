let body = new ELEM(document.body);
body.style(`
margin:1rem;
background-color:#222;
color:#fff;
height:100vh;
font-family:Arial;
`);

//title

let inputTypes = Object.fromEntries("jpg jpeg png".split(" ").map(v=>[v,v.toUpperCase()]).flat().map(v=>[v,true]));

let setExtension = function(name,ext){
    let sp = name.split(".");
    if(sp.length === 0){
        return sp+"."+ext;
    }
    let ext0 = sp.pop();
    if(!(ext0 in inputTypes)){
        sp.push(ext0);
    }
    sp.push(ext);
    return sp.join(".");
}

let types = Object.fromEntries(`
jpg jpeg
jpeg jpeg
png png
`.split("\n").filter(l=>l!=="").map(l=>l.split(" ")));
let type = "jpg";
{
    let h1 = body.add("h1",0,"Convert any image to ");
    body.add("p",0,"Convert images, no shenanigans.");
    let select = h1.add("select",0,0,`
    font-size: inherit;
    color: #fff;
    background-color: #0000;
    border-radius: 10px;
    border: solid 2px #aaa;
    `);
    for(let type in types){
        select.add("option",`value:${type}`,`.${type}`);
    };
    type = new URLSearchParams(window.location.search).get("type") || "";
    if(type in types){
        select.e.value = type;
    }else{
        select.e.value = "jpg";
        type = "jpg";
    }
    select.on("change",()=>{
        type = select.e.value;
        window.history.replaceState(null, null, `?type=${type}`);
    });
}


let dashstyle = `
padding:10px;
box-size:border-box;
border-radius:10px;
margin:10px 0px;
border:2px dashed #aaa;
display:none;
`;

let upbox = body.add("input","type:file");
let cog = body.add("div",0,"converting",dashstyle);


let disp = null;

upbox.on("input",async ()=>{
    if(disp)disp.remove();
    disp = body.add("div",0,0,dashstyle);
    cog.style("display:block;");
    let files = [...upbox.e.files];
    if(files.length === 0){
        disp.remove();
        disp = null;
        return;
    }

    let urls = await Promise.all(files.map(async file=>{
        let icon = disp.add("img",0,0,`
        max-width:10rem;
        max-height:10rem;
        margin:1rem;
        `);
        let canvas = document.createElement("canvas");
        let reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise(res=>reader.onload=res);
        let img = new Image();
        img.src = reader.result;
        await new Promise(res=>img.onload=res);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img,0,0);
        let result = canvas.toDataURL(`image/${types[type]}`);
        icon.attr("src",result);
        return [file,result];
    }));
    cog.style("display:none;");
    disp.style("display:block");
    urls.map(([file,url])=>{
        let a = document.createElement("a");
        a.download = setExtension(file.name,type);
        a.href = url;
        a.click();
        console.log(`downloading ${a.download}`);
    });
});



