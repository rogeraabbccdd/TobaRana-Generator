const { ref, onMounted, onUpdated } = Vue

const app = Vue.createApp({
  setup(props, context) {
    const input = ref({
      id: '83515285',
      name: '火山梟子',
      location: '靛之森',
      avatar: null,
      date: new Date().toLocaleDateString()
    })
    let canvas = null
    let ctx = null
    let template = null

    const date = new Date()
    const dateYear = ref(date.getFullYear())

    const handleFile = (e) => {
      const reader = new FileReader()
      input.value.file = e.target.files[0]
      reader.onload = (ee) => {
        const img = new Image()
        img.onload = () => {
          refresh()
        }
        img.src = ee.target.result
        input.value.avatar = img
      }
      reader.readAsDataURL(e.target.files[0])
    }

    const refresh = () => {
      ctx.font = '50px Arial'
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Draw avatar
      if(input.value.avatar) {
        const ratio = 280 / input.value.avatar.width
        ctx.save()
        roundedImage(499, 173, 280, input.value.avatar.height * ratio, 0)
        ctx.clip()
        ctx.drawImage(input.value.avatar, 499, 173, 280, input.value.avatar.height * ratio)
        ctx.restore()
      }
      // Background
      ctx.drawImage(template, 0, 0)
      // Draw Texts
      const fonts = 'KaiTi, 標楷體, DFKai-SB, TW-Kai, BiauKai, 华文楷体, Noto Sans TC'
      const numfonts = 'Noto Sans TC'
      colorText(input.value.id, canvas.width/2 + 290, 130, 'bold #393939', '34px ' + numfonts, 'center')
      colorText(input.value.date, 200, 230, 'bold #393939', '35px ' + numfonts, 'left')
      colorText(input.value.location, 200, 280, 'bold #393939', '40px ' + fonts, 'left')
      colorText(input.value.date, 200, 326, 'bold #393939', '35px ' + numfonts, 'left')
      colorText(input.value.name, 250, 455, 'bold #393939', '80px ' + fonts, 'center')
    }

    const colorText = (text, x, y, color, font, align) => {
      ctx.font = font
      ctx.textAlign = align
      ctx.fillStyle = color
      ctx.fillText(text, x, y)
    }

    const download = () => {
      const link = document.createElement('a')
      link.download = 'Toba.png'
      link.href = canvas.toDataURL()
      link.click()
    }

    const loadImage = (url) => {
      return new Promise((resolve) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.src = url
      })
    }

    const roundedImage = (x, y, width, height, radius) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    onMounted(async () => {
      await document.fonts.load('10pt "Noto Sans TC"')
      template = await loadImage('./images/template.png')
      input.value.avatar = await loadImage('./images/default_avatar.png')
      canvas = document.querySelector('.canvas')
      ctx = canvas.getContext('2d')
      refresh()
    })

    onUpdated(() => {
      canvas = document.querySelector('.canvas')
      ctx = canvas.getContext('2d')
      refresh()
    })

    return {
      input,
      canvas,
      ctx,
      dateYear,
      handleFile,
      refresh,
      date,
      download
    }
  }
}).mount('#app')