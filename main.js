const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const sides = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];

const svg = document.getElementById('svg');
// setAttributes(svg, { width: windowWidth, height: windowHeight });

drawRandomLoop();

function drawRandomLoop() {
  const size = 50;
  const gridWidth = Math.floor(windowWidth / size);
  const gridHeight = Math.floor(windowHeight / size);
  const side = sides[Math.floor(Math.random()*4)];

  let start = {};
  let length;
  switch(side) {
    case 'TOP':
      start.y = 0;
      start.x = Math.floor(Math.random() * gridWidth) * size;
      length = Math.floor(Math.random() * gridHeight) * size;
      break;
    case 'BOTTOM':
      start.y = windowHeight;
      start.x = Math.floor(Math.random() * gridWidth) * size;
      length = Math.floor(Math.random() * gridHeight) * size;
      break;
    case 'RIGHT':
      start.y = Math.floor(Math.random() * gridWidth) * size;
      start.x = windowWidth;
      length = Math.floor(Math.random() * gridHeight) * size;
      break;
    case 'LEFT':
      start.y = Math.floor(Math.random() * gridWidth) * size;
      start.x = 0;
      length = Math.floor(Math.random() * gridHeight) * size;
      break;
    default:
      console.log('oops');
      break;
  }
  drawLoop(start, length, size).then(drawRandomLoop);
}

function drawLoop(start, length, size) {
  let end, loopEndPoint, exitPoint;
  let loopSet = [];
  if ( start.x === 0 ) {
    // Starting from left wall
    end = adjustPoint(start, { x: length });
    loopEndPoint = adjustPoint(end, { x: -size, y: size });
    centerArc = { start: end, end: loopEndPoint, size };
    loopSet = getLeftArcSet(centerArc);
    exitPoint = { x: loopEndPoint.x, y: 0 };
  } else if ( start.x === windowWidth ) {
    // Starting from right wall
    end = adjustPoint(start, { x: -length });
    loopEndPoint = adjustPoint(end, { x: size, y: -size });
    centerArc = { start: end, end: loopEndPoint, size };
    loopSet = getRightArcSet(centerArc);
    exitPoint = { x: loopEndPoint.x, y: windowHeight };
  } else if ( start.y === 0 ) {
    // Starting from top wall
    end = adjustPoint(start, { y: length });
    loopEndPoint = adjustPoint(end, { x: -size, y: -size });
    centerArc = { start: end, end: loopEndPoint, size };
    loopSet = getTopArcSet(centerArc);
    exitPoint = { x: windowWidth, y: loopEndPoint.y };
  } else if ( start.y === windowHeight ) {
    // Starting from bottom wall
    end = adjustPoint(start, { y: -length });
    loopEndPoint = adjustPoint(end, { x: size, y: size });
    centerArc = { start: end, end: loopEndPoint, size };
    loopSet = getBottomArcSet(centerArc);
    exitPoint = { x: 0, y: loopEndPoint.y };
  } else {
    window.alert("can't start in the middle!");
  }

  const intro = getLineSet({ start, end }, size).map(getLinePath);
  const outro = getLineSet({ start: loopEndPoint, end: exitPoint }, size).map(getLinePath);

	return addLines(intro, size)
		.then(() => addLines(loopSet, size))
		.then(() => addLines(outro, size))
}

function getLeftArcSet({ start, end, size }) {
  const outerArc = {
    start: adjustPoint(start, { y: -size }),
    end: adjustPoint(end, { x: -size }),
    size: size*2
  }
  const innerArc = {
    start: adjustPoint(start, { y: size }),
    end: adjustPoint(end, { x: size }),
    size: 2
  }
  return [
    getArcPath({ start, end, size }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getBottomArcSet({ start, end, size }) {
  const outerArc = {
    start: adjustPoint(start, { x: -size }),
    end: adjustPoint(end, { y: size }),
    size: size*2
  }
  const innerArc = {
    start: adjustPoint(start, { x: size }),
    end: adjustPoint(end, { y: -size }),
    size: 2
  }
  return [
    getArcPath({ start, end, size }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getRightArcSet({ start, end, size }) {
  const outerArc = {
    start: adjustPoint(start, { y: size }),
    end: adjustPoint(end, { x: size }),
    size: size*2
  }
  const innerArc = {
    start: adjustPoint(start, { y: -size }),
    end: adjustPoint(end, { x: -size }),
    size: 2
  }
  return [
    getArcPath({ start, end, size }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getTopArcSet({ start, end, size }) {
  const outerArc = {
    start: adjustPoint(start, { x: size }),
    end: adjustPoint(end, { y: -size }),
    size: size*2
  }
  const innerArc = {
    start: adjustPoint(start, { x: -size }),
    end: adjustPoint(end, { y: size }),
    size: 2
  }
  return [
    getArcPath({ start, end, size }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function addLines(paths, size) {
  return new Promise((resolve, reject) => {
    let time;
    paths.map((path, i) => {
      const pathEl = createSVG('path', { d: path });
      if ( i === 0 ) {
        const backgroundEl = createSVG('path',
          { d: path,
            class: 'background',
            style: 'stroke-width: ' + size*2 + 'px' });
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
function getLineSet({ start, end }, size) {
  let firstLine, secondLine;
  if ( start.x === end.x ) /* vertical */ {
    firstLine = {
      start: adjustPoint(start, { x: -size }),
      end: adjustPoint(end, { x: -size })
    };
    secondLine = {
      start: adjustPoint(start, { x: size }),
      end: adjustPoint(end, { x: size })
    }
  } else if ( start.y === end.y ) /* horizontal */ {
    firstLine = {
      start: adjustPoint(start, { y: -size }),
      end: adjustPoint(end, { y: -size })
    };
    secondLine = {
      start: adjustPoint(start, { y: size }),
      end: adjustPoint(end, { y: size })
    }
  } else {
    window.alert("this math is too hard! we  quit!");
  }
  return [{ start, end }, firstLine, secondLine];
}

function adjustPoint(point, adjustment) {
  const x = adjustment.x ? point.x + adjustment.x : point.x;
  const y = adjustment.y ? point.y + adjustment.y : point.y;
  return { x, y };
}

function getLinePath({ start, end }) {
  return "M " + start.x + " " + start.y + " L " + end.x + " " + end.y;
}

function getArcPath({ start, end, size }) {
  return "M " + start.x + " " + start.y + " A " + size + " " + size + " 0 1 1 " + end.x + " " + end.y;
}

function createSVG(type, attributes) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", type);
  return attributes ? setAttributes(el, attributes) : svgEl
}

function setAttributes(el, attributes) {
  for ( attribute in attributes ) {
    el.setAttribute(attribute, attributes[attribute]);
  }
  return el;
}

function getFirstOfClass(className, parentElement) {
  const result = parentElement ?
    parentElement.getElementsByClassName(className)[0] :
    document.getElementsByClassName(className)[0];
  return result;
}
