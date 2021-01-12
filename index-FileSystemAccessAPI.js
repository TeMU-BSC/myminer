// As per 2021-01-12, the File System Access API only works with Chrome and Chromium-based web browsers
// https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API

const loadFileButton = document.getElementById('loadFileButton')
const saveFileButton = document.getElementById('saveFileButton')
const textContainer = document.getElementById('textContainer')
const acceptButton = document.getElementById('acceptButton')
const rejectButton = document.getElementById('rejectButton')
const lines = []
const results = []
let filename

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
loadFileButton.onclick = async () => {
  const [handle] = await window.showOpenFilePicker()
  const file = await handle.getFile()
  filename = file.name
  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target.result
    lines.push(...content.split(/\r?\n/))
    textContainer.textContent = lines.shift()
  }
  reader.onerror = (event) => {
    alert(event.target.error.name)
  }
  reader.readAsText(file)
}

const markAs = (hasChosen) => {
  const text = textContainer.textContent
  results.push({ text, hasChosen })
  textContainer.textContent = lines.shift()
}
acceptButton.onclick = () => markAs(true)
rejectButton.onclick = () => markAs(false)

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream
saveFileButton.onclick = async () => {
  const tsv = results.map(result => `${result.text}\t${result.hasChosen}`).join('\n')
  const defaultFilename = `${filename}_myminer_results_${new Date().toISOString()}.tsv`
  const textFile = new File([tsv], defaultFilename, { type: 'text/plain' })
  const handle = await window.showSaveFilePicker()
  const writable = await handle.createWritable()
  await writable.write(textFile)
  await writable.close()
}
