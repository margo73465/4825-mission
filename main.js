const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const size = 30;
const sides = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];

const svg = getFirstOfClass('canvas');
setAttributes(svg, { width: windowWidth, height: windowHeight });

const start1 = { x: 0, y: 50 };
const length = 100;
drawLoop(start1, length, size);
// const start2 = { x: windowWidth, y: 200 };
// drawLoop(start2, length, size);
// const start3 = { x: 300, y: 0 };
// drawLoop(start3, length, size);
// const start4 = { x: 100, y: windowHeight };
// drawLoop(start4, 500, size);
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

  let start = {};
  let length;
  switch(side) {
    case 'TOP':
      start.y = 0;
      start.x = Math.floor(Math.random()*windowWidth);
      length = Math.floor(Math.random()*windowHeight);
      break;
    case 'BOTTOM':
      start.y = windowHeight;
      start.x = Math.floor(Math.random()*windowWidth);
      length = Math.floor(Math.random()*windowHeight);
      break;
    case 'RIGHT':
      start.y = Math.floor(Math.random()*windowWidth);
      start.x = windowWidth;
      length = Math.floor(Math.random()*windowHeight);
      break;
    case 'LEFT':
      start.y = Math.floor(Math.random()*windowHeight);
      start.x = 0;
      length = Math.floor(Math.random()*windowHeight);
      break;
    default:
      console.log('oops');
      break;
  }
  drawLoop(start, length, 30);
}

function drawLoop(start, length, size) {
  let pathSet;
  if ( start.x === 0 ) {
    pathSet = getRightPathSet(start, turn);
    // pathSet = getRightPathSet(start, length, size);
  } else if ( start.x === windowWidth ) {
    pathSet = getLeftPathSet(start, length, size);
  } else if ( start.y === 0 ) {
    pathSet = getDownPathSet(start, length, size);
  } else if ( start.y === windowHeight ) {
    pathSet = getUpPathSet(start, length, size);
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

/*
*  line = {
*    start: { x: , y: },
*    end: { x: , y: }
*  }
*
*  arc = {
*    start: { x: , y: },
*    end: { x: , y: },
*    width: ?
*    curve_direction: ?
*  }
*/
function getRightPathSet(line) {
  // const loopPointX = length;
  // const emergentPointY = start.y - width;
  // loopStart = { x: start.x + length, y: start.y }
  // loopEnd = { x: length - width, y: start.y + width}
  // emergentLineStart = { x: length - width, y: start.y - width }
	let intro = [];
	let loop = [];
	let outro = [];

	intro.push(getLinePath(line));
	intro.push(getLinePath(getParallelLine(line, { x: 0, y: width })));
	intro.push(getLinePath(getParallelLine(line, { x: 0, y: -width })));

  const arc = {
    start: line.end,
    end: addPoints(end, { x: -width, y: width },
    width
  };
	loop.push(getArcPath(arc));
	loop.push(getArcPath(getInnerArc(arc)));
	loop.push(getArcPath(getOuterArc(arc)));

  const outLine = {
    start: arcCenter.end,
    end: Object.assign(arcCenter.end, { y: 0 });
  };
	outro.push(getLinePath(middleOut));
	outro.push(getLinePath(getParallelLine(middleOut, { x: -width, y: 0 })));
	outro.push(getLinePath(getParallelLine(middleOut, { x: width, y: 0 })));
	return { intro, loop, outro };
}

// change getLinePath to accept { start, end } object
// update caller of get____PathSet to use start and end

function getInnerArc({ start, end, width }) {
  return {
    start: addPoints(line.end, { x: 0, y: -width }),
    end: { x: end.x - 2, y: start.y + width },
    width: 1
  };
}

function getOuterArc({ start, end, width }) {
  return {
    start: addPoints(end, { x: 0, y: width }),
    end: { x: end.x - width*2, y: start.y + width },
    width: width*2
  };
}

function getParallelLine({ start, end }, offset) {
  const parallelStart = addPoints(start, offset);
  const parallelEnd = addPoints(end, offset);
  return {
    start: parallelStart,
    end: parallelEnd
  };
}

function getParallelArc({ start, end }) {
}

function addPoints(first, second) {
  return { x: first.x + second.x, y: first.y + second.y };
}

function getLeftPathSet(start, end) {
  // const loopPointX = windowWidth - length;
  // const emergentPointY = start.y + width;
	let intro = [];
	let loop = [];
	let outro = [];
	intro.push(getLinePath(start, end));
	intro.push(getLinePath({ x: start.x, y: start.y - width}, { x: end.x, y: start.y - width }));
	intro.push(getLinePath({ x: start.x, y: start.y + width}, { x: end.x, y: start.y + width }));
	loop.push(getArcPath({ x: start.x + length, y: start.y }, width, { x: end.x - width, y: start.y + width }));
	loop.push(getArcPath({ x: start.x + length, y: start.y - width }, width*2, { x: end.x - width*2, y: start.y + width }));
	loop.push(getArcPath({ x: start.x + length, y: start.y + width }, 1, { x: end.x - 2, y: start.y + width }));
	outro.push(getLinePath({ x: end.x - width, y: start.y - width - 1}, " V ", 0));
	outro.push(getLinePath({ x: end.x - width*2, y: start.y - width - 1}, " V ", 0));
	outro.push(getLinePath({ x: end.x, y: start.y - width - 1}, " V ", 0));

  pathSet.push(getPath(start, " H ", windowWidth - length, width, { x: (windowWidth - length) + width, y: start.y - width }));
  pathSet.push(getPath({ x: start.x, y: start.y + width }, " H ", windowWidth - length, width*2, { x: (windowWidth - length) + width*2, y: start.y - width }));
  pathSet.push(getPath({ x: start.x, y: start.y - width }, " H ", windowWidth - length, 1, { x: (windowWidth - length) + 2, y: start.y - width }));
  pathSet.push(getLinePath({ x: (windowWidth - length) + width, y: start.y + width }, " V ", windowHeight));
  pathSet.push(getLinePath({ x: (windowWidth - length) + width*2, y: start.y + width }, " V ", windowHeight));
  pathSet.push(getLinePath({ x: (windowWidth - length), y: start.y + width }, " V ", windowHeight));
  return pathSet;
}

function getUpPathSet(start, length, width) {
  // const loopPointY = windowHeight - length;
  // const emergentPointX = start.x - width;
  let pathSet = [];
  pathSet.push(getPath(start, " V ", windowHeight - length, width, { x: start.x + width, y: (windowHeight - length) + width }));
  pathSet.push(getPath({ x: start.x - width, y: start.y }, " V ", windowHeight - length, width*2, { x: start.x + width, y: (windowHeight - length) + width*2 }));
  pathSet.push(getPath({ x: start.x + width, y: start.y }, " V ", windowHeight - length, 1, { x: start.x + width, y: (windowHeight - length) + 2 }));
  pathSet.push(getLinePath({ x: start.x - width, y: (windowHeight - length) + width }, " H ", 0));
  pathSet.push(getLinePath({ x: start.x - width, y: (windowHeight - length) + width*2 }, " H ", 0));
  pathSet.push(getLinePath({ x: start.x - width, y: (windowHeight - length) }, " H ", 0));
  return pathSet;
}

function getDownPathSet(start, length, width) {
  // const loopPointY = length;
  // const emergentPointX = start.x + width;
  let pathSet = [];
  pathSet.push(getPath(start, " V ", length, width, { x: start.x - width, y: length - width }));
  pathSet.push(getPath({ x: start.x + width, y: start.y }, " V ", length, width*2, { x: start.x - width, y: length - width*2 }));
  pathSet.push(getPath({ x: start.x - width, y: start.y }, " V ", length, 1, { x: start.x - width, y: length - 2 }));
  pathSet.push(getLinePath({ x: start.x + width, y: length - width }, " H ", windowWidth));
  pathSet.push(getLinePath({ x: start.x + width, y: length - width*2 }, " H ", windowWidth));
  pathSet.push(getLinePath({ x: start.x + width, y: length }, " H ", windowWidth));
  return pathSet;
}


/*
 * Utilities
 */
function getPath(start, direction, length, arcSize, end) {
  return getLinePath(start, direction, length) + getArcPath(arcSize, end);
}

function getLinePath(start, direction, length) {
  return "M " + start.x + " " + start.y + direction + length;
}

function getLinePath(start, end) {
  return "M " + start.x + " " + start.y + " L " + end.x + " " end.y;
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
