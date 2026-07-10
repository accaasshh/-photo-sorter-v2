const gallery = document.getElementById("gallery");

const uploadBtn = document.getElementById("uploadBtn");
const uploadInput = document.getElementById("uploadInput");

const folderBtn = document.getElementById("folderBtn");
const folderInput = document.getElementById("folderInput");

const total = document.getElementById("total");
const active = document.getElementById("active");
const inactive = document.getElementById("inactive");

const search = document.getElementById("search");

const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const closePreview = document.getElementById("closePreview");

let photos = [];

/* ==========================
   LOAD PHOTOS
========================== */

async function loadPhotos() {

    const res = await fetch("/photos");

    photos = await res.json();

    renderPhotos();

}

/* ==========================
   IMAGE UPLOAD
========================== */

uploadBtn.onclick = () => uploadInput.click();

uploadInput.onchange = uploadFiles;

folderBtn.onclick = () => folderInput.click();

folderInput.onchange = uploadFiles;

async function uploadFiles(e){

    const files = e.target.files;

    if(!files.length) return;

    const formData = new FormData();

    for(const file of files){

        formData.append("photos",file);

    }

    await fetch("/upload",{

        method:"POST",

        body:formData

    });

    e.target.value="";

    await loadPhotos();

}

/* ==========================
   RENDER
========================== */

function renderPhotos(){

    const keyword = search.value.toLowerCase();

    const filtered = photos.filter(photo =>
        photo.originalName
        .toLowerCase()
        .includes(keyword)
    );

    total.innerText = photos.length;

    active.innerText =
        photos.filter(p=>p.status==="ACTIVE").length;

    inactive.innerText =
        photos.filter(p=>p.status==="INACTIVE").length;

    if(filtered.length===0){

        gallery.innerHTML=`
        <div class="empty">

            <h2>No Photos Found</h2>

            <p>Upload images to begin.</p>

        </div>
        `;

        return;

    }

    gallery.innerHTML="";

    filtered.forEach(photo=>{

        gallery.innerHTML+=`

<div class="photo ${photo.status}">

<button
class="deleteIcon"
onclick="removePhoto(${photo.id})">
🗑
</button>

<div class="imageWrapper">

<img
src="/uploads/${photo.filename}"
alt="${photo.originalName}"
onclick="openPreview('/uploads/${photo.filename}')">

</div>

<div class="photoContent">

<h3>${photo.originalName}</h3>

<div class="status ${photo.status==="ACTIVE" ? "active":"inactive"}">

${photo.status}

</div>

<div class="buttons">

<button
class="activeBtn ${photo.status==="ACTIVE"?"selected":""}"
onclick="setStatus(${photo.id},'ACTIVE')">

Active

</button>

<button
class="inactiveBtn ${photo.status==="INACTIVE"?"selected":""}"
onclick="setStatus(${photo.id},'INACTIVE')">

Inactive

</button>

</div>

</div>

</div>

`;

    });

}

/* ==========================
   STATUS
========================== */

async function setStatus(id,status){

    await fetch(`/photos/${id}`,{

        method:"PATCH",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            status
        })

    });

    await loadPhotos();

}

/* ==========================
   DELETE
========================== */

async function removePhoto(id){

    if(!confirm("Delete this photo?")) return;

    await fetch(`/photos/${id}`,{

        method:"DELETE"

    });

    await loadPhotos();

}

/* ==========================
   IMAGE PREVIEW
========================== */

function openPreview(src){

    previewImage.src=src;

    preview.classList.add("active");

}

closePreview.onclick=()=>{

    preview.classList.remove("active");

};

preview.onclick=(e)=>{

    if(e.target===preview){

        preview.classList.remove("active");

    }

};

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        preview.classList.remove("active");

    }

});

/* ==========================
   SEARCH
========================== */

search.oninput=renderPhotos;

/* ==========================
   START
========================== */

loadPhotos();