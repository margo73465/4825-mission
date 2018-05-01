const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const size = 30;
const sides = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];

const svg = getFirstOfClass('canvas');
setAttributes(svg, { width: windowWidth, height: windowHeight });

const startPoint1 = { x: 0, y: 50 };
const length = 100;
drawLoop(startPoint1, length, size);
// const startPoint2 = { x: windowWidth, y: 200 };
// drawLoop(startPoint2, length, size);
// const startPoint3 = { x: 300, y: 0 };
// drawLoop(startPoint3, length, size);
// const startPoint4 = { x: 100, y: windowHeight };
// drawLoop(startPoint4, 500, size);
// drawRandomLoop();
// drawRandomLoop();
// drawRandomLoop();
// drawRandomLoop();
// drawRandomLoop();

/*
* fix little indent from lines out
* figure out line speed...
* animate backgrounds correctly
*
* grid???
*/

function drawRandomLoop() {
  const side = sides[Math.floor(Math.random()*4)];

  let startPoint = {};
  let length;
  switch(side) {
    case 'TOP':
      startPoint.y = 0;
      startPoint.x = Math.floor(Math.random()*windowWidth);
      length = Math.floor(Math.random()*windowHeight);
      break;
    case 'BOTTOM':
      startPoint.y = windowHeight;
      startPoint.x = Math.floor(Math.random()*windowWidth);
      length = Math.floor(Math.random()*windowHeight);
      break;
    case 'RIGHT':
      startPoint.y = Math.floor(Math.random()*windowWidth);
      startPoint.x = windowWidth;
      length = Math.floor(Math.random()*windowHeight);
      break;
    case 'LEFT':
      startPoint.y = Math.floor(Math.random()*windowHeight);
      startPoint.x = 0;
      length = Math.floor(Math.random()*windowHeight);
      break;
    default:
      console.log('oops');
      break;
  }
  drawLoop(startPoint, length, 30);
}

function drawLoop(startPoint, length, size) {
  let pathSet;
  if ( startPoint.x === 0 ) {
    pathSet = getRightPathSet(startPoint, length, size);
  } else if ( startPoint.x === windowWidth ) {
    pathSet = getLeftPathSet(startPoint, length, size);
  } else if ( startPoint.y === 0 ) {
    pathSet = getDownPathSet(startPoint, length, size);
  } else if ( startPoint.y === windowHeight ) {
    pathSet = getUpPathSet(startPoint, length, size);
  } else {
    window.alert("can't start in the middle!");
  }

	const { intro, loop, outro } = pathSet;
	addLines(intro)
		.then(() => addLines(loop))
		.then(() => addLines(outro));
}

function addLines(paths) {
  return new Promise((resolve, reject) => {
    let time;
    paths.map((path, i) => {
      const pathEl = createSVG('path', { d: path });
      if ( i === 0 ) {
        const backgroundEl = createSVG('path', { d: path, class: 'background' });
        const length = backgroundEl.getTotalLength();
        time = length/100;
        animatePath(backgroundEl, time);
      }
      animatePath(pathEl, time);
    });
    return window.setTimeout(resolve, time*1000);
  });
};

function animatePath(path, time) {
	const length = path.getTotalLength();
	path.style.animation = time ? 'dash ' + time + 's linear forwards' : 'dash ' + length/100 + 's linear forwards';
	path.style.strokeDasharray = length;
	path.style.strokeDashoffset = length;
  svg.appendChild(path);
	return path;
}

function getRightPathSet(startPoint, length, width) {
  // const loopPointX = length;
  // const emergentPointY = startPoint.y - width;
	let intro = [];
	let loop = [];
	let outro = [];
	intro.push(getLinePath(startPoint, " H ", length));
	intro.push(getLinePath({ x: startPoint.x, y: startPoint.y - width}, " H ", length));
	intro.push(getLinePath({ x: startPoint.x, y: startPoint.y + width}, " H ", length));
	loop.push(getArcPath({ x: startPoint.x + length, y: startPoint.y }, width, { x: length - width, y: startPoint.y + width }));
	loop.push(getArcPath({ x: startPoint.x + length, y: startPoint.y - width }, width*2, { x: length - width*2, y: startPoint.y + width }));
	loop.push(getArcPath({ x: startPoint.x + length, y: startPoint.y + width }, 1, { x: length - 2, y: startPoint.y + width }));
	outro.push(getLinePath({ x: length - width, y: startPoint.y - width - 1}, " V ", 0));
	outro.push(getLinePath({ x: length - width*2, y: startPoint.y - width - 1}, " V ", 0));
	outro.push(getLinePath({ x: length, y: startPoint.y - width - 1}, " V ", 0));
	return { intro, loop, outro };
}

function getLeftPathSet(startPoint, length, width) {
  // const loopPointX = windowWidth - length;
  // const emergentPointY = startPoint.y + width;
  let pathSet = [];
  pathSet.push(getPath(startPoint, " H ", windowWidth - length, width, { x: (windowWidth - length) + width, y: startPoint.y - width }));
  pathSet.push(getPath({ x: startPoint.x, y: startPoint.y + width }, " H ", windowWidth - length, width*2, { x: (windowWidth - length) + width*2, y: startPoint.y - width }));
  pathSet.push(getPath({ x: startPoint.x, y: startPoint.y - width }, " H ", windowWidth - length, 1, { x: (windowWidth - length) + 2, y: startPoint.y - width }));
  pathSet.push(getLinePath({ x: (windowWidth - length) + width, y: startPoint.y + width }, " V ", windowHeight));
  pathSet.push(getLinePath({ x: (windowWidth - length) + width*2, y: startPoint.y + width }, " V ", windowHeight));
  pathSet.push(getLinePath({ x: (windowWidth - length), y: startPoint.y + width }, " V ", windowHeight));
  return pathSet;
}

function getUpPathSet(startPoint, length, width) {
  // const loopPointY = windowHeight - length;
  // const emergentPointX = startPoint.x - width;
  let pathSet = [];
  pathSet.push(getPath(startPoint, " V ", windowHeight - length, width, { x: startPoint.x + width, y: (windowHeight - length) + width }));
  pathSet.push(getPath({ x: startPoint.x - width, y: startPoint.y }, " V ", windowHeight - length, width*2, { x: startPoint.x + width, y: (windowHeight - length) + width*2 }));
  pathSet.push(getPath({ x: startPoint.x + width, y: startPoint.y }, " V ", windowHeight - length, 1, { x: startPoint.x + width, y: (windowHeight - length) + 2 }));
  pathSet.push(getLinePath({ x: startPoint.x - width, y: (windowHeight - length) + width }, " H ", 0));
  pathSet.push(getLinePath({ x: startPoint.x - width, y: (windowHeight - length) + width*2 }, " H ", 0));
  pathSet.push(getLinePath({ x: startPoint.x - width, y: (windowHeight - length) }, " H ", 0));
  return pathSet;
}

function getDownPathSet(startPoint, length, width) {
  // const loopPointY = length;
  // const emergentPointX = startPoint.x + width;
  let pathSet = [];
  pathSet.push(getPath(startPoint, " V ", length, width, { x: startPoint.x - width, y: length - width }));
  pathSet.push(getPath({ x: startPoint.x + width, y: startPoint.y }, " V ", length, width*2, { x: startPoint.x - width, y: length - width*2 }));
  pathSet.push(getPath({ x: startPoint.x - width, y: startPoint.y }, " V ", length, 1, { x: startPoint.x - width, y: length - 2 }));
  pathSet.push(getLinePath({ x: startPoint.x + width, y: length - width }, " H ", windowWidth));
  pathSet.push(getLinePath({ x: startPoint.x + width, y: length - width*2 }, " H ", windowWidth));
  pathSet.push(getLinePath({ x: startPoint.x + width, y: length }, " H ", windowWidth));
  return pathSet;
}


/*
 * Utilities
 */
function getPath(startPoint, direction, length, arcSize, endPoint) {
  return getLinePath(startPoint, direction, length) + getArcPath(arcSize, endPoint);
}

function getLinePath(start, direction, length) {
  return "M " + start.x + " " + start.y + direction + length;
}

function getArcPath(start, size, end) {
  return "M " + start.x + " " + start.y + " A " + size + " " + size + " 0 1 1 " + end.x + " " + end.y;
}

function createSVG(type, attributes) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", type);
  return attributes ? setAttributes(el, attributes) : svgEl
}

function createDOM(type, attributes, text) {
  const el = document.createElement(type);
  if ( attributes ) {
    setAttributes(el, attributes);
  }
  if ( text ) {
    setText(el, text);
  }
  return el;
}

function setAttributes(el, attributes) {
  for ( attribute in attributes ) {
    el.setAttribute(attribute, attributes[attribute]);
  }
  return el;
}

function setText(el, text) {
  const textNode = document.createTextNode(text);
  el.appendChild(textNode);
  return el;
}

function getFirstOfClass(className, parentElement) {
  const result = parentElement ?
    parentElement.getElementsByClassName(className)[0] :
    document.getElementsByClassName(className)[0];
  return result;
}
