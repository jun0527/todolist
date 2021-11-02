const addInput = document.querySelector('.js-addInput');
const addBtn = document.querySelector('.js-addBtn');
const todoList = document.querySelector('.js-listBody');
const todoListArea = document.querySelector('.js-todoListArea');
const listTags = document.querySelectorAll('.js-listHeader li');
const listTagBtnList = document.querySelector('.js-listHeader');
const listNum = document.querySelector('.js-listNum');
const deleteAll = document.querySelector('.js-deleteAll');

let todoListAll = [];
let listStatus = 'all';
//網頁初始狀態渲染
function init() {
  renderList();
}
init();
//新增待辦事項功能
addBtn.addEventListener('click', addList);
addInput.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 13:
      addList();
      break;
  }
})
function addList() {
  switch (addInput.value.trim()) {
    case '':
      alert('請輸入待辦事項！');
      break;
    default:
      let obj = {};
      obj.content = addInput.value.trim();
      obj.id = new Date().getTime();
      obj.checked = false;
      todoListAll.push(obj);
      addInput.value = '';
      tagStatusReset();
      listTags[0].classList.add('active');
      listStatus = 'all';
      renderList();
  }
}
//將陣列內容渲染到網頁
function renderList() {
  let list;
  switch(listStatus) {
    case 'all':
      list = todoListAll;
      break;
    case 'undone':
      list = todoListAll.filter((item) => !item.checked)
      break;
    case 'done':
      list = todoListAll.filter((item) => item.checked)
      break;
  }
  switch (todoListAll.length) {
    case 0:
      todoListArea.classList.add('d-none');
      break;
    default:
      todoListArea.classList.remove('d-none');
      let str = '';
      list.forEach((item, index) => {
        str += `<li class="js-todoListItem todoListItem ${item.checked ? 'checked' : ''}" data-id="${item.id}" data-index="${index}">
          <div class="checkboxArea">
            <input class="js-checkbox checkbox" type="checkbox" id="${item.id}" ${item.checked ? 'checked' : ''}>
            <span class="material-icons bg-white">
              check_box_outline_blank
            </span>
            <span class="checkboxChecked material-icons d-none bg-white text-primary">
              check
            </span>
          </div>
          <label class="listContent" for="${item.id}">${item.content}</label>
          <div class="deleteBtnArea">
            <button class="js-deleteBtn deleteBtn" type="button">
              <span class="material-icons d-block">
                clear
              </span>
            </button>
          </div>
        </li>`
      })
      todoList.innerHTML = str;
      renderUndoneNum();
      break;
    }
  }
  //渲染待完成項目數量、清除已完成項目按鈕狀態
  function renderUndoneNum() {
    let undoneList = todoListAll.filter((item) => !item.checked)
    listNum.textContent = undoneList.length;
    let doneList = todoListAll.filter((item) => item.checked)
    switch (doneList.length) {
      case 0:
        deleteAll.classList.add('disabled');
        break;
      default:
        deleteAll.classList.remove('disabled');
        break;
    }
}
//待辦清單完成、刪除功能
todoList.addEventListener('click', editList);
function editList(e) {
  const checkboxList = document.querySelectorAll('.js-checkbox');
  switch (e.target.nodeName) {
    case 'INPUT':
      break;
    default:
      let checkedId = e.target.closest('li').dataset.id;
      //filterIndex為依分頁篩選出來的陣列的index
      let filterIndex = e.target.closest('li').dataset.index;
      //allListIndex為在todoListAll的index
      let allListIndex = findIdIndex(checkedId);
      isBtn = e.target.closest('button');
      switch (isBtn) {
        case null:
          let isChecked = checkboxList[filterIndex].checked;
          checkboxList[filterIndex].checked = !isChecked;
          todoListAll[allListIndex].checked = checkboxList[filterIndex].checked;
          break;
        default:
          todoListAll.splice(allListIndex, 1);
          break;
      }
      renderList();
      break;
  }
}
//刪除全部完成清單
deleteAll.addEventListener('click', () => {
  todoListAll = todoListAll.filter((item) => {
    if (!item.checked) {
      return item;
    }
  })
  tagStatusReset();
  listTags[0].classList.add('active');
  listStatus = 'all';
  renderList();
})
//找出索引值
function findIdIndex(id) {
  let idIndex = todoListAll.findIndex((item) => {
    return item.id === parseInt(id);
  })
  return idIndex;
}

//切換頁籤
listTagBtnList.addEventListener('click', changeTagBtn);
function changeTagBtn(e) {
  console.log(e.target.closest('li'));
  console.log(e.target.closest('li').dataset.btn);
  tagStatusReset();
  li = e.target.closest('li');
  listStatus = e.target.closest('li').dataset.btn;
  li.classList.add('active');
  renderList();
}
//清除所有頁籤active
function tagStatusReset() {
  listTags.forEach((item) => {
    item.classList.remove('active');
  })
}