<template>
  <div class="page">

    <h1 class="title">
      {{ $t("title") }}
    </h1>

    <div class="main-card">

      <!-- 左侧控制区域 -->
      <div class="control-panel">

        <label class="upload-btn">

          {{ $t("upload") }}

          <input
              type="file"
              accept="image/*"
              hidden
              @change="loadImage"
          >

        </label>

        <div class="language-box">

          <label>
            🌐
            {{ $t("language") }}
          </label>

          <select v-model="$i18n.locale">

            <option value="zh">
              中文
            </option>


            <option value="ja">
              日本語
            </option>


            <option value="en">
              English
            </option>

          </select>

        </div>

        <div class="control-item">

          <label>

            {{ $t("width") }}

            :
            {{ width }}

          </label>

          <input

              type="range"

              min="20"

              max="100"

              v-model.number="width"

              @input="sliderChange"

          >

        </div>

        <div class="control-item">

          <label>

            {{ $t("customWidth") }}

          </label>

          <input

              class="number-input"

              type="number"

              v-model="inputWidth"

              @keydown.enter="submitWidth"

          >

          <p class="tip">

            {{ $t("range") }}

          </p>

        </div>

        <div class="control-item">

          <label>

            {{ $t("style") }}

          </label>

          <select

              v-model="chars"

              @change="generate"

          >

            <option value="⠁⠂⠄⡀⢀⣀⣤⣶⣿">

              {{ $t("braille") }}

            </option>

            <option value=".:-=+*#%@">

              {{ $t("ascii") }}

            </option>

            <option value="               .,:;i1tfLCG08@">

              {{ $t("fineAscii") }}

            </option>

          </select>

        </div>

        <button

            class="copy-btn"

            v-if="image"

            @click="copy"

        >

          {{ $t("copy") }}

        </button>

      </div>

      <!-- 右侧预览区域 -->

      <div

          class="preview-panel"

          v-if="image"

      >

        <pre class="preview">
{{ result }}
        </pre>

      </div>

    </div>
    <!-- 页面底部按钮 -->

    <div class="footer-icons">

      <a
          class="icon-button"
          href="https://github.com/Wh17eN1gh7"
          target="_blank"
      >

        <img src="../public/icons/mdi--github.svg">

      </a>

      <a
          class="icon-button"
          href="mailto:Noritovo@gmail.com"
      >

        <img src="../public/icons/clarity--email-line.svg">

      </a>

    </div>

    © 2026 Unicode Character Art Generator
    <canvas
        ref="canvas"
        style="display:none"
    ></canvas>

  </div>

</template>

<script setup>

import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const canvas = ref(null)

const result = ref("")

const width = ref(70)

const inputWidth = ref(70)

const chars = ref(
    "⠁⠂⠄⡀⢀⣀⣤⣶⣿"
)

const image = ref(null)

function loadImage(event){

  const file = event.target.files[0]

  if(!file)
    return

  const img = new Image()

  img.onload = ()=>{

    image.value = img

    generate()

  }

  img.src = URL.createObjectURL(file)

}

function sliderChange(){

  inputWidth.value = width.value

  generate()

}

function submitWidth(){

  let value = Number(inputWidth.value)

  if(value < 20){

    value = 20

  }

  if(value > 100){

    value = 100

  }

  width.value = value

  inputWidth.value = value

  generate()

}

function generate(){

  if(!image.value)

    return

  const cvs = canvas.value

  const ctx = cvs.getContext("2d")

  const ratio =

      image.value.height /

      image.value.width

  const currentWidth =

      Number(width.value)

  const height =

      Math.floor(

          currentWidth *

          ratio *

          0.5

      )

  cvs.width = currentWidth

  cvs.height = height

  ctx.drawImage(

      image.value,

      0,

      0,

      currentWidth,

      height

  )

  const pixels =

      ctx.getImageData(

          0,

          0,

          currentWidth,

          height

      ).data

  let text = ""

  for(

      let i = 0;

      i < pixels.length;

      i += 4

  ){

    const r = pixels[i]

    const g = pixels[i+1]

    const b = pixels[i+2]

    const gray =

        r * 0.299 +

        g * 0.587 +

        b * 0.114

    const index =

        Math.floor(

            gray /

            255 *

            (chars.value.length - 1)

        )

    text += chars.value[index]

  }

  let lines = []

  for(

      let i = 0;

      i < text.length;

      i += currentWidth

  ){

    lines.push(

        text.substring(

            i,

            i + currentWidth

        )

    )

  }

  result.value =

      lines.join("\r\n")

}

async function copy(){

  await navigator.clipboard.writeText(

      result.value

  )

  alert(

      t("copied")

  )

}

</script>

<style scoped>

.page{

  width:100%;

  min-height:100vh;

  display:flex;

  flex-direction:column;

  align-items:center;

  padding-top:40px;

  padding-left:15px;

  padding-right:15px;

}



.title{

  font-size:clamp(32px,5vw,48px);

  font-weight:700;

  letter-spacing:2px;

  color:#333;

  margin-bottom:40px;

  text-align:center;

}





.main-card{

  width:100%;

  max-width:1100px;

  min-height:600px;

  display:flex;

  background:white;

  border-radius:20px;

  box-shadow:

      0 10px 30px

      rgba(0,0,0,0.1);

  overflow:hidden;

}






.control-panel{


  width:300px;


  padding:30px;


  display:flex;


  flex-direction:column;


  gap:25px;


  background:#ededed;


}





.upload-btn{


  display:block;


  padding:12px;


  background:#ffffff;


  color:#000000;


  text-align:center;


  border-radius:10px;


  cursor:pointer;


  font-weight:bold;


  transition:.2s;


}





.upload-btn:hover{

  box-shadow:12px 12px 12px rgba(0,0,0,0.1);

}






.language-box,

.control-item{


  display:flex;


  flex-direction:column;


  gap:10px;


}







select,

input[type="number"]{


  padding:8px;


  border-radius:8px;


  border:1px solid #ccc;


  font-size:15px;


}







input[type="range"]{


  width:100%;


}







.number-input{


  width:100px;


}








.tip{


  font-size:12px;


  color:#777;


  line-height:1.5;


}








.copy-btn{


  margin-top:auto;


  padding:12px;


  border:none;


  border-radius:10px;


  background:#333;


  color:white;


  cursor:pointer;


  font-size:16px;


  transition:.2s;


}







.copy-btn:hover{

  box-shadow:12px 12px 12px rgba(0,0,0,0.2);

}









.preview-panel{


  flex:1;


  min-width:0;


  display:flex;


  justify-content:center;


  align-items:center;


  padding:30px;


  overflow:auto;


}







.preview{


  background:#111;


  color:white;


  padding:25px;


  border-radius:10px;


  line-height:1;


  font-family:


      "Cascadia Mono",


      "Consolas",


      monospace;


  white-space:pre;


  margin:0;


  max-width:100%;


  overflow:auto;


}








.footer-icons{


  margin-top:60px;


  display:flex;


  justify-content:center;


  gap:20px;


}







.icon-button{


  width:64px;


  height:64px;


  display:flex;


  justify-content:center;


  align-items:center;


  transition:transform .3s ease;


}







.icon-button img{


  width:48px;


  height:48px;


}







.icon-button:hover{


  transform:translateY(-5px);


}









/* 手机适配 */

@media(max-width:800px){


  .page{

    padding-top:20px;

  }




  .main-card{


    flex-direction:column;


    width:100%;


    min-height:auto;


  }






  .control-panel{


    width:100%;


    padding:20px;


  }






  .preview-panel{


    width:100%;


    padding:20px;


    min-height:300px;


  }






  .preview{


    font-size:10px;


    padding:15px;


  }






  .footer-icons{


    margin-top:40px;


  }



}



</style>