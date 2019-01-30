let dragObject = {};
let tower = null;
let $tower = null;
(function() {

  let moves;
  let	disksNum = 7;
  let	minMoves = 127;
  let $canves = document.getElementById('canves');
  let	$restart = $canves.querySelectorAll('.restart')[0];
  let $tower = $canves.querySelectorAll('.tower');
  let	$scorePanel = $canves.querySelectorAll('#score-panel')[0];
  let	$movesCount = $scorePanel.querySelectorAll('#moves-num');


	function initGame(tower) {
		$tower[0].textContent = '';
		$tower[1].textContent = '';
		$tower[2].textContent = '';
		moves = 0;
		$movesCount[0].textContent = 0;
		for (let i = 1; i <= disksNum; i++) {
			tower.innerHTML = '<li class="ball disk disk-' + i + '" data-value="' + i + '"></li>' + tower.innerHTML;
		}
	}

	function countMove() {
		moves++;
		$movesCount[0].textContent = moves;

		if (moves > minMoves - 1) {
			if ($tower.eq(1).children().length === disksNum || $tower.eq(2).children().length === disksNum) {
				alert('Наші вітання! Ви виграли');
				initGame($tower.eq(0));
			}
		}
	}

	tower = function (tower) {
		if (tower) {
      var $topDisk = tower.querySelectorAll('.disk');
		}

		if (tower && dragObject.elem && dragObject.elem.dataset.value && ($topDisk.length === 0 || ($topDisk[$topDisk.length - 1].dataset.value && $topDisk[$topDisk.length - 1].dataset.value > dragObject.elem.dataset.value))) {
			dragObject.elem.parentNode.removeChild(dragObject.elem);
			tower.innerHTML += '<li class="ball disk disk-' + dragObject.elem.dataset.value + '" data-value="' + dragObject.elem.dataset.value + '"></li>';
      countMove();
		} else {
			dragObject.elem.parentNode.removeChild(dragObject.elem);
			dragObject.tower.innerHTML += '<li class="ball disk disk-' + dragObject.elem.dataset.value + '" data-value="' + dragObject.elem.dataset.value + '"></li>';
		}
	};

	initGame($tower[0]);

	$restart.onclick = function(e){
		if (confirm('Ви впевнені? Прогрес буде втрачено!')) {
			initGame($tower[0]);
		}
	};

	document.onmousedown = function(e) {
	  if (e['which'] !== 1) {
	    return;
	  }

    let elem = e.target.closest('.ball');
    let tower = e.target.closest('.tower');

    if (!elem) return;

    const smallestEl = Array.from(tower.children).map((e) => e.dataset.value).sort()[0];
    if (smallestEl != elem.dataset.value) return;

	  dragObject.elem = elem;
		dragObject.tower = tower;
	  dragObject.downX = e.pageX;
	  dragObject.downY = e.pageY;

	};

	document.onmousemove = function(e) {
	  if (!dragObject.elem) return;

	  if ( !dragObject.avatar ) {

      let moveX = e.pageX - dragObject.downX;
      let moveY = e.pageY - dragObject.downY;
	    if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) {
	      return;
	    }

	    dragObject.avatar = createAvatar(e);
	    if (!dragObject.avatar) {
	      dragObject = {};
	      return;
	    }

      let coords = getCoords(dragObject.avatar);
	    dragObject.shiftX = dragObject.downX - coords.left;
	    dragObject.shiftY = dragObject.downY - coords.top;

	    startDrag(e);
	  }

	  dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
	  dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

	  return false;
	}
})();

function getCoords(elem) {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}

function createAvatar(e) {
  let avatar = dragObject.elem;
  let old = {
    parent: avatar.parentNode,
    nextSibling: avatar.nextSibling,
    position: avatar.position || '',
    left: avatar.left || '',
    top: avatar.top || '',
    zIndex: avatar.zIndex || ''
  };

  avatar.rollback = function() {
    old.parent.insertBefore(avatar, old.nextSibling);
    avatar.style.position = old.position;
    avatar.style.left = old.left;
    avatar.style.top = old.top;
    avatar.style.zIndex = old.zIndex
  };

  return avatar;
}

function startDrag(e) {
  let avatar = dragObject.avatar;

  document.body.appendChild(avatar);
  avatar.style.zIndex = 9999;
  avatar.style.position = 'absolute';
}

document.onmouseup = function(e) {
  if (dragObject.avatar) {
    finishDrag(e);
  }

  dragObject = {};
};

function finishDrag(e) {
  let dropElem = findDroppable(e);
	tower(dropElem);
}

function findDroppable(event) {
	dragObject.avatar.style.display = 'none';

  let elem = document.elementFromPoint(event.clientX, event.clientY);

	dragObject.avatar.style.display = '';

  if (elem == null) {
    return null;
  }

  return elem.closest('.tower');
}
