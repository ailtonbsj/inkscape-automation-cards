const path = require('path')
const fs = require('fs')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

/*
# COMAND

npm run start model.svg ./photos/

ARGUMENTS

model.svg -> Model of image SVG
./photos/    -> folder with images

# SVG IDs

#card      -> Group to duplicate
#arg1      -> Text of group with text: Argumento1
#arg2      -> Text of group with text: Argumento2
#arg3      -> Text of group with text: Argumento3

# FILE NAMES STRUCTURE

arg1,arg2,arg3.jpg

*/

function personalNameCase (str) {
  return str.split(' ')
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ')
}

const figure = process.argv[2]
const folder = process.argv[3]

const data = fs.readFileSync(figure, { encoding: 'utf8', flag: 'r' })
const dom = new JSDOM(data)

let offset = 150
let pathName = './alunos/'
fs.readdirSync(folder).forEach(function (fileName) {
  const fileNameArgs = fileName.split('.jpg')[0].split(',')
  const card = dom.window.document.querySelector('#card').cloneNode(true)
  card.setAttribute('transform', `translate(${offset},0)`)
  offset += 150
  const arg1 = card.querySelector('#arg1')
  arg1.innerHTML = arg1.innerHTML.replace('Argumento1', fileNameArgs[0] + ' Pontos')
  const arg2 = card.querySelector('#arg2')
  arg2.innerHTML = arg2.innerHTML.replace('Argumento2', personalNameCase(fileNameArgs[1]))
  const arg3 = card.querySelector('#arg3')
  arg3.innerHTML = arg3.innerHTML.replace('Argumento3', fileNameArgs[2])

  const image = fs.readFileSync(folder + fileName, { encoding: 'base64' })
  card.querySelector('#argImg').setAttribute('xlink:href', 'data:image/jpeg;base64,' + image)

  dom.window.document.querySelector('#card').parentNode.appendChild(card)
})

//fs.writeFileSync('frag.svg', card.outerHTML)
fs.writeFileSync('output.svg', dom.window.document.body.innerHTML)