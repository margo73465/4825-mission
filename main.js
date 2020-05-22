const SIZE = 50;
const windowWidth = Math.ceil(window.innerWidth / SIZE) * SIZE;
const windowHeight = Math.ceil(window.innerHeight / SIZE) * SIZE;
const sides = ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'];

const svg = document.getElementById('svg');
// setAttributes(svg, { width: windowWidth, height: windowHeight });

drawRandomLoop();

function drawRandomLoop() {
  const gridWidth = Math.floor(windowWidth / SIZE);
  const gridHeight = Math.floor(windowHeight / SIZE);
  const side = sides[Math.floor(Math.random()*4)];

  let start = {};
  let length;
  switch(side) {
    case 'TOP':
      start.y = 0;
      start.x = Math.floor(Math.random() * gridWidth) * SIZE;
      length = Math.floor(Math.random() * gridHeight) * SIZE;
      break;
    case 'BOTTOM':
      start.y = windowHeight;
      start.x = Math.floor(Math.random() * gridWidth) * SIZE;
      length = Math.floor(Math.random() * gridHeight) * SIZE;
      break;
    case 'RIGHT':
      start.y = Math.floor(Math.random() * gridWidth) * SIZE;
      start.x = windowWidth;
      length = Math.floor(Math.random() * gridHeight) * SIZE;
      break;
    case 'LEFT':
      start.y = Math.floor(Math.random() * gridWidth) * SIZE;
      start.x = 0;
      length = Math.floor(Math.random() * gridHeight) * SIZE;
      break;
    default:
      console.log('oops');
      break;
  }
  drawLoop(start, length, SIZE).then(drawRandomLoop);
}

function drawLoop(start, length, SIZE) {
  let end, loopEndPoint, exitPoint;
  let loopSet = [];
  if ( start.x === 0 ) {
    // Starting from left wall
    end = adjustPoint(start, { x: length });
    loopEndPoint = adjustPoint(end, { x: -SIZE, y: SIZE });
    centerArc = { start: end, end: loopEndPoint, SIZE };
    loopSet = getLeftArcSet(centerArc);
    exitPoint = { x: loopEndPoint.x, y: 0 };
  } else if ( start.x === windowWidth ) {
    // Starting from right wall
    end = adjustPoint(start, { x: -length });
    loopEndPoint = adjustPoint(end, { x: SIZE, y: -SIZE });
    centerArc = { start: end, end: loopEndPoint, SIZE };
    loopSet = getRightArcSet(centerArc);
    exitPoint = { x: loopEndPoint.x, y: windowHeight };
  } else if ( start.y === 0 ) {
    // Starting from top wall
    end = adjustPoint(start, { y: length });
    loopEndPoint = adjustPoint(end, { x: -SIZE, y: -SIZE });
    centerArc = { start: end, end: loopEndPoint, SIZE };
    loopSet = getTopArcSet(centerArc);
    exitPoint = { x: windowWidth, y: loopEndPoint.y };
  } else if ( start.y === windowHeight ) {
    // Starting from bottom wall
    end = adjustPoint(start, { y: -length });
    loopEndPoint = adjustPoint(end, { x: SIZE, y: SIZE });
    centerArc = { start: end, end: loopEndPoint, SIZE };
    loopSet = getBottomArcSet(centerArc);
    exitPoint = { x: 0, y: loopEndPoint.y };
  } else {
    window.alert("can't start in the middle!");
  }

  const intro = getLineSet({ start, end }, SIZE).map(getLinePath);
  const outro = getLineSet({ start: loopEndPoint, end: exitPoint }, SIZE).map(getLinePath);

	return addLines(intro, SIZE)
		.then(() => addLines(loopSet, SIZE))
		.then(() => addLines(outro, SIZE))
}

function getLeftArcSet({ start, end, SIZE }) {
  const outerArc = {
    start: adjustPoint(start, { y: -SIZE }),
    end: adjustPoint(end, { x: -SIZE }),
    SIZE: SIZE*2
  }
  const innerArc = {
    start: adjustPoint(start, { y: SIZE }),
    end: adjustPoint(end, { x: SIZE }),
    SIZE: 2
  }
  return [
    getArcPath({ start, end, SIZE }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getBottomArcSet({ start, end, SIZE }) {
  const outerArc = {
    start: adjustPoint(start, { x: -SIZE }),
    end: adjustPoint(end, { y: SIZE }),
    SIZE: SIZE*2
  }
  const innerArc = {
    start: adjustPoint(start, { x: SIZE }),
    end: adjustPoint(end, { y: -SIZE }),
    SIZE: 2
  }
  return [
    getArcPath({ start, end, SIZE }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getRightArcSet({ start, end, SIZE }) {
  const outerArc = {
    start: adjustPoint(start, { y: SIZE }),
    end: adjustPoint(end, { x: SIZE }),
    SIZE: SIZE*2
  }
  const innerArc = {
    start: adjustPoint(start, { y: -SIZE }),
    end: adjustPoint(end, { x: -SIZE }),
    SIZE: 2
  }
  return [
    getArcPath({ start, end, SIZE }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function getTopArcSet({ start, end, SIZE }) {
  const outerArc = {
    start: adjustPoint(start, { x: SIZE }),
    end: adjustPoint(end, { y: -SIZE }),
    SIZE: SIZE*2
  }
  const innerArc = {
    start: adjustPoint(start, { x: -SIZE }),
    end: adjustPoint(end, { y: SIZE }),
    SIZE: 2
  }
  return [
    getArcPath({ start, end, SIZE }),
    getArcPath(innerArc),
    getArcPath(outerArc)
  ]
}

function addLines(paths, SIZE) {
  return new Promise((resolve, reject) => {
    let time;
    paths.map((path, i) => {
      const pathEl = createSVG('path', { d: path });
      if ( i === 0 ) {
        const backgroundEl = createSVG('path',
          { d: path,
            class: 'background',
            style: 'stroke-width: ' + SIZE*2 + 'px' });
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
function getLineSet({ start, end }, SIZE) {
  let firstLine, secondLine;
  if ( start.x === end.x ) /* vertical */ {
    firstLine = {
      start: adjustPoint(start, { x: -SIZE }),
      end: adjustPoint(end, { x: -SIZE })
    };
    secondLine = {
      start: adjustPoint(start, { x: SIZE }),
      end: adjustPoint(end, { x: SIZE })
    }
  } else if ( start.y === end.y ) /* horizontal */ {
    firstLine = {
      start: adjustPoint(start, { y: -SIZE }),
      end: adjustPoint(end, { y: -SIZE })
    };
    secondLine = {
      start: adjustPoint(start, { y: SIZE }),
      end: adjustPoint(end, { y: SIZE })
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

function getArcPath({ start, end, SIZE }) {
  return "M " + start.x + " " + start.y + " A " + SIZE + " " + SIZE + " 0 1 1 " + end.x + " " + end.y;
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
