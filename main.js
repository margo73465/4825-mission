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
  let end, loopEndPoint, exitPoint, side;
  if ( start.x === 0 ) {
    end = {};
    loopEndPoint = {};
    exitPoint = {};
  } else if ( start.x === windowWidth ) {
    pathSet = getLeftPathSet(start, length, size);
  } else if ( start.y === 0 ) {
    pathSet = getDownPathSet(start, length, size);
  } else if ( start.y === windowHeight ) {
    pathSet = getUpPathSet(start, length, size);
  } else {
    window.alert("can't start in the middle!");
  }

	const { intro, loop, outro } = getPathSet({ start, end }, loopEndPoint, exitPoint);

  const intro = getIntroPaths({ start, end});
  const loop = getLoopPaths({ end, loopEndPoint });
  const outro = getOutroPaths({ loopEndPoint, exitPoint });

  const intro = getLineSet({ start, end });
  const loop = getArcSet({ end, loopEndPoint }, side);
  const outro = getLineSet({ loopEndPoint, exitPoint });

	addLines(intro)
		.then(() => addLines(loop))
		.then(() => addLines(outro));
}

function getLeftArcSet({ start, end }) {
  const outerArc = {
    start: adjustPoint(start, { y: -width }),
    end: adjustPoint(end, { x: -width }),
    size: width*2
  }
  const innerArc = {
    start: adjustPoint(start, { y: width }),
    end: adjustPoint(end, { x: width }),
    size: 2
  }
  return [
    getArcPath({ start, end, size: width },
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getBottomArcSet({ start, end }) {
  const outerArc = {
    start: adjustPoint(start, { x: -width }),
    end: adjustPoint(end, { y: width }),
    size: width*2
  }
  const innerArc = {
    start: adjustPoint(start, { x: width }),
    end: adjustPoint(end, { y: -width }),
    size: 2
  }
  return [
    getArcPath({ start, end, size: width },
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getRightArcSet({ start, end }) {
  const outerArc = {
    start: adjustPoint(start, { y: width }),
    end: adjustPoint(end, { x: width }),
    size: width*2
  }
  const innerArc = {
    start: adjustPoint(start, { y: -width }),
    end: adjustPoint(end, { x: -width }),
    size: 2
  }
  return [
    getArcPath({ start, end, size: width },
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getTopArcSet({ start, end }) {
  const outerArc = {
    start: adjustPoint(start, { x: width }),
    end: adjustPoint(end, { y: -width }),
    size: width*2
  }
  const innerArc = {
    start: adjustPoint(start, { x: -width }),
    end: adjustPoint(end, { y: width }),
    size: 2
  }
  return [
    getArcPath({ start, end, size: width },
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getArcSet({ start, end }, side) {
  let innerArc, outerArc;
  if ( side === "left" ){
    innerArc = {
      start: { x: , y: },
      end: { x: , y: },
      size: width
    };
    outerArc = {
    }
  } else if ( side === "bottom" ) {
  } else if ( side === "
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
*    size: ?
*    curve_direction: ?
*  }
*/
// update caller of get____PathSet to use start and end

function getRightPathSet(line, loopEndPoint, exitPoint) {
  // const loopPointX = length;
  // const emergentPointY = start.y - width;
  // loopStart = { x: start.x + length, y: start.y }
  // loopEnd = { x: length - width, y: start.y + width}
  // emergentLineStart = { x: length - width, y: start.y - width }

	const edges = getParallelLines(line));
  const intro = [line].concat(edges);

  const arc = {
    start: line.end,
    end: loopEndPoint,
    size: width
  };
	const innerArc = getInnerArc(arc);
	const outerArc = getOuterArc(arc);
  const loop = [arc, innerArc, outerArc];

  const lineOut = {
    start: loopEndPoint,
    end: exitPoint
  };
	const edgesOut = getParallelLines(lineOut));
  const outro = [lineOut].concat(edgesOut);

	return { intro, loop, outro };
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
 * Utilities
 */
function getInnerArc({ start, end, width }) {
  return {
    start: addPoints(end, { x: 0, y: -width }),
    end: { x: end.x - 2, y: start.y + width },
    size: 1
  };
}

function getOuterArc({ start, end, width }) {
  return {
    start: addPoints(end, { x: 0, y: width }),
    end: { x: end.x - width*2, y: start.y + width },
    size: width*2
  };
}

function getParallelLines({ start, end }) {
  let firstLine, secondLine;
  if ( start.x === end.x ) /* vertical */ {
    firstLine = {
      start: adjustPoint(start, { y: -width });
      end: adjustPoint(end, { y: -width });
    };
    secondLine = {
      start: adjustPoint(start, { y: width });
      end: adjustPoint(end, { y: width });
    }
  } else if ( start.y === end.y ) /* horizontal */ {
    firstLine = {
      start: adjustPoint(start, { x: -width });
      end: adjustPoint(end, { x: -width });
    };
    secondLine = {
      start: adjustPoint(start, { x: width });
      end: adjustPoint(end, { x: width });
    }
  } else {
    window.alert("this math is too hard! we  quit!");
  }
  return [firstLine, secondLine];
}

function addPoints(first, second) {
  return {
    x: first.x + second.x,
    y: first.y + second.y
  };
}

function adjustPoint(point, adjustment) {
  const x = adjustment.x ? point.x + adjustment.x : point.x;
  const y = adjustment.y ? point.y + adjustment.y : point.y;
  return { x, y };
}

function getLinePath({ start, end }) {
  return "M " + start.x + " " + start.y + " L " + end.x + " " end.y;
}

function getArcPath({ start, end, size }) {
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
