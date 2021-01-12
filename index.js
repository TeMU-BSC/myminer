const loadFileInput = document.getElementById('loadFileInput')
const saveFileLink = document.getElementById('saveFileLink')
const textContainer = document.getElementById('textContainer')
const acceptButton = document.getElementById('acceptButton')
const rejectButton = document.getElementById('rejectButton')
const lines = []
const results = []
let filename

loadFileInput.onchange = (event) => {
  const file = event.target.files[0]
  filename = file.name.replace(/\.[^/.]+$/, '')
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

saveFileLink.onclick = () => {
  const tsv = results.map(result => `${result.text}\t${result.hasChosen}`).join('\n')
  const data = new Blob([tsv], { type: 'text/plain;charset=UTF-8"', encoding: "UTF-8" })
  const url = window.URL.createObjectURL(data)
  saveFileLink.href = url
  saveFileLink.download = `${filename}_myminer_results_${new Date().toISOString()}.tsv`
}
