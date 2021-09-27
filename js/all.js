const addInput = document.querySelector('.js-addInput');
const addBtn = document.querySelector('.js-addBtn');
const todoList = document.querySelector('.js-listBody');
const todoListArea = document.querySelector('.js-todoListArea');
const listTags = document.querySelectorAll('.js-listHeader li');
const listTagBtnList = document.querySelectorAll('.js-listHeader li a');
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
addBtn.addEventListener('click', () => {
  switch (addInput.value) {
    case '':
      alert('請輸入待辦事項！');
      break;
    default:
      let obj = {};
      obj.content = addInput.value;
      obj.id = Date.parse(new Date());
      obj.checked = false;
      todoListAll.push(obj);
      addInput.value = '';
      tagStatusReset();
      listTags[0].setAttribute('class', 'active');
      listStatus = 'all';
      renderList();
  }
})
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
      todoListArea.setAttribute('class', 'js-todoListArea todoListArea d-none');
      break;
    default:
      todoListArea.setAttribute('class', 'js-todoListArea todoListArea');
      let str = '';
      list.forEach((item, index) => {
        str += `<li class="js-todoListItem todoListItem ${item.checked ? 'checked' : ''}">
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
            <button class="js-deleteBtn deleteBtn" type="button" data-id="${item.id}">
              <span class="material-icons d-block" data-id="${item.id}">
                clear
              </span>
            </button>
          </div>
        </li>`
      })
      todoList.innerHTML = str;
      renderUndoneNum();
      editList();
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
        deleteAll.setAttribute('class', 'js-deleteAll deleteAll disabled');
        break;
      default:
        deleteAll.setAttribute('class', 'js-deleteAll deleteAll');
        break;
    }
}
//待辦清單完成、刪除功能
function editList() {
  const listItems = document.querySelectorAll('.js-todoListItem');
  const checkboxList = document.querySelectorAll('.js-checkbox');
  const deleteBtnList = document.querySelectorAll('.js-deleteBtn');
  //判斷是否完成
  checkboxList.forEach((item, index) => {
    item.addEventListener('change', () => {
      let checkedId = item.getAttribute('id');
      let checkIndex = findIdIndex(checkedId);
      switch (item.checked) {
        case true:
          listItems[index].setAttribute('class', 'js-todoListItem todoListItem checked');
          todoListAll[checkIndex].checked = true;
          break;
        case false:
          listItems[index].setAttribute('class', 'js-todoListItem todoListItem');
          todoListAll[checkIndex].checked = false;
          break;
      }
      renderList();
    })
  })
  //刪除待辦清單
  deleteBtnList.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      let deleteId = e.target.getAttribute('data-id');
      let deleteIndex = findIdIndex(deleteId);
      todoListAll.splice(deleteIndex, 1);
      renderList();
    })
  })
}
//刪除全部完成清單
deleteAll.addEventListener('click', () => {
  let deleteIndexArr = [];
  todoListAll.forEach((item, index) => {
    switch (item.checked) {
      case true:
        deleteIndexArr.push(index);
        break;
      }
  })
  deleteIndexArr.reverse().forEach((item) => {
    todoListAll.splice(item, 1);
  })
  renderList();
})
//找出索引值
function findIdIndex(id) {
  let idIndex = '';
  todoListAll.forEach((item, index) => {
    switch (item.id) {
      case parseInt(id):
        idIndex = index;
        break;
    }
  })
  return idIndex;
}

//切換頁籤
function changeStatus() {
  listTagBtnList.forEach((item, index) => {
    item.addEventListener('click', () => {
      tagStatusReset();
      switch (index) {
        case 0:
          listStatus = 'all';
          break;
        case 1:
          listStatus = 'undone';
          break;
        case 2:
          listStatus = 'done';
          break;
      }
      listTags[index].setAttribute('class', 'active');
      renderList();
    })
  })
}
changeStatus();
function tagStatusReset() {
  listTags.forEach((item) => {
    item.setAttribute('class', '');
  })
}