<template>
  <div>
    <div class="content">
      <template>
        <div
          :class="['dropZone', dragging ? 'dropZone-over' : '']"
          @dragenter="dragging = true"
          @dragleave="dragging = false"
        >
          <div
            class="dropZone-info"
            @drag="onChange"
          >
            <v-icon class="icon-file">mdi-cloud-upload-outline</v-icon>
            <br />
            <p :class="fontSize ? 'texFileProduct' : 'texFile'">
              {{ myCustomMessage }}
            </p>
          </div>
          <input
            ref="inputFile"
            type="file"
            @change="onChange"
          />
        </div>
      </template>
      <template v-if="file">
        <div
          class="name-docs"
          v-for="item in file"
          :key="item.name"
        >
          <span
            class="cursor-p left pt-1"
            @click="removeFile(item.name)"
          >
            <v-icon>mdi-delete-circle-outline</v-icon>
          </span>
          {{ item.name }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Messages from '@/services/messages'
export default {
  props: ['lengthFile', 'sizeFile', 'docsType', 'fontSize', 'fileCache'],
  data () {
    return {
      file: [],
      dragging: false
    }
  },
  beforeMount () {
    try {
      if (this.fileCache) {
        this.file = this.fileCache
      }
    } catch (error) {
      this.file = []
    }
  },
  methods: {
    ...mapMutations(['SHOW_SNACKBAR']),
    onChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        this.dragging = false
        return
      }
      if (this.file.length + 1 > this.lengthFile) {
        this.dragging = false
        // this.clean()
        // Show Message Snackbar
        // return this.$store.commit('SHOW_SNACKBAR', {
        //   snackbar: true,
        //   text: 'An error has occurred, try again',
        //   color: 'warning'
        // })
        // return this.SHOW_SNACKBAR({
        //   snackbar: true,
        //   text: `${Messages.file.error.length} "${this.lengthFile}"`,
        //   color: 'errorIntense'
        // })
      } else {
        this.createFile(files)
      }
    },
    createFile (file) {
      if (!this.$generalService.sizeValidFile(file, this.sizeFile * 1000000)) {
        this.clean()
        this.dragging = false
        return this.$store.commit('SHOW_SNACKBAR', {
          snackbar: true,
          text: `${Messages.file.error.size} (${this.sizeFile} MB)`,
          color: 'errorIntense'
        })
      }
      this.emitFile(file[0])
      this.dragging = false
    },
    removeFile (nameFile) {
      this.file = this.file.filter((val) => val.name !== nameFile)
      if (this.file.length === 0) {
        this.clean()
      }
    },
    clean () {
      this.file = []
      this.$refs.inputFile.value = null
      this.emitFile(null)
    },
    emitFile (file) {
      if (file) this.file.push(file)
      this.$emit('inputFile', this.file)
    }
  },
  computed: {
    extension () {
      return this.file ? this.file.name.split('.').pop() : ''
    },
    myCustomMessage () {
      let text = null
      if (parseInt(this.lengthFile) > 1) {
        text = `Arrastrar o seleccionar hasta ${this.lengthFile} archivos para adjuntar`
      }
      if (parseInt(this.lengthFile) === 1) {
        text = 'Arrastrar o seleccionar el archivo para adjuntar'
      }
      // arrastre o seleccione aquí el archivo que desee adjuntar
      return `${text} (${this.docsType}). Tamaño máximo ${this.sizeFile} MB`
    }
  }
}
</script>
<style scoped>
.dropZone {
  width: 100%;
  min-height: 170px;
  position: relative;
  border: 0.5rem solid #fff;
  border-radius: 15px;
}

.content {
  background: #cccccc;
  border-radius: 15px;
  border: 5px solid #cccccc;
}

.icon-file {
  font-size: 4rem;
  color: #cccccc;
  margin-top: 20px;
}

.dropZone:hover {
  border: 0.5rem solid #f1f1f1;
}

.dropZone:hover .dropZone-title {
  color: #1975a0;
}

.dropZone-info {
  background: #fff;
  position: absolute;
  width: 100%;
  text-align: center;
  height: 100%;
}

.dropZone-title {
  color: #787878;
}

.name-docs {
  margin-left: 1rem;
  width: 100%;
  font-weight: 400;
}
.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  width: 80%;
  height: 200px;
  position: relative;
  border: 2px dashed #eee;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}
.texFile {
  text-align: center;
  font-size: 12px;
  font-style: oblique;
  color: gray;
}
.texFileProduct {
  text-align: center;
  font-size: 10px;
  font-style: oblique;
  color: gray;
}
</style>
