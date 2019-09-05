var districts = document.querySelector("#districts");
var hotDistrictsArea = document.querySelector("#hotDistricts");
var cardContentArea = document.querySelector("#cardContent");
var hotBtn = document.getElementsByClassName("hot-btn"); // My Note：getElementsByClassName 可抓取動態產生的瀏覽器物件，但querySelector不能
var cardContentTitle = document.querySelector("#districtsTitle");
var pageLink = document.getElementsByClassName("page-link");	
var page = document.querySelector(".page"); 
var districtsArr = [];
var districtsFilterArr = [];
var districtsHotArr = {};
var sortable = [];
var cardContentArr = [];

// 區域選擇 下拉選單出現 樣式
districts.onclick = function() {	
	districts.classList.toggle('dropdown');
};

// 產生地區的option值
function addDistricts() {
	// 把資料集的 鄉鎮市區 存在陣列內			
	for (var i = 0; i < record.length; i++) {
		districtsArr.push(record[i].鄉鎮市區);		
	}

	// 過濾陣列中重複值
	districtsFilterArr = districtsArr.filter(function(element, index, arr) {
		return arr.indexOf(element) === index;
	});
	
	// 將每個資料轉進option
	for (var i = 0; i < districtsFilterArr.length; i++) {
		var districtsOpt = document.createElement("option");
		districtsOpt.setAttribute("value", districtsFilterArr[i]);
		districtsOpt.textContent = `${districtsFilterArr[i]}`;
		districts.appendChild(districtsOpt);
	}	
}

// 熱門行政區 選景點數量最多的前五個行政區
function hotDistricts() {	
	// 篩選重複 存入物件 紀錄 {行政區:重複次數}
	districtsArr.forEach(function(item, index, array) {
	  	districtsHotArr[item] = districtsHotArr[item] ? districtsHotArr[item] + 1 : 1;
	});	

	// 先將物件轉陣列	
	for (var item in districtsHotArr) {
	    sortable.push([item, districtsHotArr[item]]);
	}

	sortable.sort(function(a, b) {
	    return b[1] - a[1];
	});

	console.log(sortable);

	//取景點數量前五多的行政區	
	for (var i = 0; i < 5; i++) {		
		var hotDistrictsBtn = document.createElement("input");
		hotDistrictsBtn.setAttribute("type", "button");
		hotDistrictsBtn.setAttribute("class", "hot-btn");
		hotDistrictsBtn.setAttribute("value", sortable[i][0]);
		hotDistrictsArea.appendChild(hotDistrictsBtn);		
	}	
}

// 產生選擇景點的資料
function createCard(e) {	
	var selectedDistricts = e.target.value;	
	var cardContent = "";		
	var total = 0;

	//內容標題變更為選擇的行政區
	cardContentTitle.textContent = selectedDistricts;

	//將指定行政區景點資料存入陣列
	cardContentArr.length = 0; //清空陣列

	for (var i = 0; i < record.length; i++) {
		if (record[i].鄉鎮市區 == selectedDistricts) {			
			cardContentArr.push({
				name:record[i].名稱,
				status:record[i].狀態,
				address:record[i].地址,
				phone:record[i].電話,
				image:""
			});
		}
	}
	
	total = cardContentArr.length;
	createPage(total);
		
	//畫面顯示
	if (cardContentArr.length < 6) {
		for (var i = 0; i < cardContentArr.length; i++) {
			if (i < cardContentArr.length) {
				cardContent += `<div class="box">
								<div class="card">
									<div class="top">
										<div class="top-img" style="background-image:url(${cardContentArr[i].image})"></div>
										<div class="title">${cardContentArr[i].name}</div>
									</div>
									<div class="bottom">
										<p><i class="fa fa-clock-o" aria-hidden="true"></i>${cardContentArr[i].status}</p>
					            		<p><i class="fa fa-map-marker" aria-hidden="true"></i>${cardContentArr[i].address}</p>
							            <p><i class="fa fa-phone" aria-hidden="true"></i>${cardContentArr[i].phone}</p>
							        </div>
							    </div>
							</div>`;
			}
			
		}
	} else {
		for (var i = 0; i < 6; i++) {
			if (i < cardContentArr.length) {
				cardContent += `<div class="box">
								<div class="card">
									<div class="top">
										<div class="top-img" style="background-image:url(${cardContentArr[i].image})"></div>
										<div class="title">${cardContentArr[i].name}</div>
									</div>
									<div class="bottom">
										<p><i class="fa fa-clock-o" aria-hidden="true"></i>${cardContentArr[i].status}</p>
					            		<p><i class="fa fa-map-marker" aria-hidden="true"></i>${cardContentArr[i].address}</p>
							            <p><i class="fa fa-phone" aria-hidden="true"></i>${cardContentArr[i].phone}</p>
							        </div>
							    </div>
							</div>`;
			}
			
		}
	}
	
	cardContentArea.innerHTML = cardContent;		
}

// 依照分頁顯示固定數量資料
function showCard(e) {	
	console.log(e);
	var pageNum = e.target.dataset.page;
	var cardContent = ``;

	for (var i = 0; i < pageLink.length; i++) {
		pageLink[i].classList.remove("selected");
	}	
	e.target.classList.add("selected");	
	
	for (var i = ((pageNum * 6) - 6); i < (pageNum * 6); i++) {
	    if (i < cardContentArr.length) {
	        cardContent += `<div class="box" data-temp="${cardContentArr[i].name}">
								<div class="card">
									<div class="top">
										<div class="top-img" style="background-image:url(${cardContentArr[i].image})"></div>
										<div class="title">${cardContentArr[i].name}</div>
									</div>
									<div class="bottom">
										<p><i class="fa fa-clock-o" aria-hidden="true"></i>${cardContentArr[i].status}</p>
							            <p><i class="fa fa-map-marker" aria-hidden="true"></i>${cardContentArr[i].address}</p>
									    <p><i class="fa fa-phone" aria-hidden="true"></i>${cardContentArr[i].phone}</p>
									</div>
								</div>
							</div>`;
	    }
	}
	
	cardContentArea.innerHTML = cardContent;	
}

// 建立分頁
function createPage(total) {
	var pagination = total / 6;
	var left = total % 6;
	pagination += 1;

	var str = ``;
	// var prev = `<a href="#">&lt; prev</a>`;
	// var next = `<a href="#">next &gt;</a>`;
	for (var i = 0; i < pagination - 1; i++) {		
		str += `<a href="#" class="page-link" data-page="${i + 1}">${i + 1}</a>`;
	}

	page.innerHTML = str;

	page.addEventListener("click", showCard, false);		
}

function init() {
	addDistricts();
	hotDistricts();	
	
	districts.addEventListener("change", createCard, false);

	for(var i = 0; i < hotBtn.length; i++){
	  	hotBtn[i].addEventListener("click", createCard, false);
	};

	hotBtn[0].click(); //顯示第一個熱門行政區景點
}

init();