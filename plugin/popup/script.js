$(document).ready(function(){

  $('.toggler').on('click', function(){ 
    if(!$('.dropdown_inline').hasClass('open')) {
      $('.dropdown_inline').addClass('open')
    } else {
      $('.dropdown_inline').removeClass('open')
    }
  })

  const redux_category = () => {
  
    const checkbox_group = document.querySelectorAll('input[type="checkbox"]')
        , category_group = document.getElementsByClassName('category-group__folder')
        , search_input   =  $('#q')

    const data = [
      ...Array.prototype.map.call(checkbox_group, e => e.checked),
      ...Array.prototype.map.call(category_group, e => $(e).hasClass('full')),
      search_input.val()
    ]

    localStorage.setItem('redux_category', JSON.stringify(data))
  }

   var save_search = function(){

    var query =  $('#q').val().replace(/#/g, '!sharp').replace(/\+/g, '!plus');

    var onlyfree = $('input[name="only_free"]').prop('checked')
    var onlycontacts = $('input[name="only_with_contacts"]').prop('checked')
    var onlyfolio = $('input[name="only_portfolio"]').prop('checked')
    var onlyreviews = $('input[name="only_reviews"]').prop('checked')

    var only_verified = $('input[name="only_verified"]').prop('checked')
    var only_mentioned = $('input[name="only_mentioned"]').prop('checked')
    var only_with_price = $('input[name="only_with_price"]').prop('checked')
    var by_relevance = $('input[name="by_relevance"]').prop('checked')

    var fieldNames = ['tags', 'title', 'description'];
    var fields = [];
    fieldNames.forEach(function(name){
      var el = $('input[name="fields[' + name + ']"]:checked');
      if (el.length > 0){ fields.push(name) };
    });

    var categories = [];
    $('ul.category-group input[name="category[]"]:checked').each(function(i, checkbox){
      categories.push($(checkbox).val());
    })

    var params = {};
    if( query !== '' ) params.q = query;
    if( onlyfree ) params.onlyfree = true;
    if( onlyfolio ) params.onlyfolio = true;
    if( onlyreviews ) params.onlyreviews = true;
    if( onlycontacts ) params.onlycontacts = true;
    if( only_verified ) params.only_verified = true;
    if( only_mentioned ) params.only_mentioned = true;
    if( only_with_price ) params.only_with_price = true;
    if( by_relevance ) params.by_relevance = true;
    if( categories.length > 0 ) params.categories = categories.join(',');
    if( fields.length > 0 ) params.fields = fields.join(',');

    var _params = '?'+decodeURIComponent(jQuery.param(params));

    localStorage.params = _params
    localStorage.notify = $('#notify').prop('checked')
  }

  $('.btn_green').on('click', () => {
    save_search();
    window.close();
  })

  var category_group = $('ul.category-group')

  var fieldNames = ['tags', 'title', 'description'];
  fieldNames.forEach(function(name){
    $('input[name="fields[' + name + ']"]').on('change', function() {
      redux_category()
    });
  });

  $('#q').on('input', function () {
    redux_category()
  })

  // обработка списка категорий в правой части сайта
  $('li',category_group).each(function(i, category){

    // раскривашка :)
    $('.js-toggle', category).on('click', function(){
      if( $(category).hasClass('category-group__folder_open') ){
        $('.category-group__folder_open',category_group).removeClass('category-group__folder_open')
      }else{
        $('.category-group__folder_open',category_group).removeClass('category-group__folder_open')
        $(category).addClass('category-group__folder_open')
      }
    })

    // клик по чекбоксу группы категорий
    $('.js-checkbox_group', category).on('click', function(){

      // если нажали на частично выделенный чекбокс, то выделим его полностью
      if( $(category).hasClass('part') ) {
        $(category).removeClass('part')
        $(category).addClass('full')
        $('ul.sub-categories li input[type="checkbox"]', category).prop('checked', true)

      // если нажали на полностью выделенный чекбокс, то снимем выделение
      }else if( $(category).hasClass('full') ) {
        $(category).removeClass('full')
        $('ul.sub-categories li input[type="checkbox"]', category).prop('checked', false)

      // если нажали на не выделенный чекбокс, то поставим выделение
      }else {
        $(category).addClass('full')
        $('ul.sub-categories li input[type="checkbox"]', category).prop('checked', true)
      }

      redux_category()

    })

    // клик по чекбоксу категории
    $('ul.sub-categories li input[type="checkbox"]', category).on('click', function(){
      redux_category()
    })
  })

  $('input[name="only_verified"], input[name="only_mentioned"], input[name="only_with_price"], input[name="by_relevance"]').on('change', function() {
    redux_category()
  });

  $('#cancel').click(function(){
    $('.category-group__folder').removeClass('full')
    $('.category-group__folder').removeClass('part')
    $('.sub-categories__item label input[type="checkbox"]').prop('checked', false)

    redux_category()

    return false
  })

  ;(() => {
    const checkbox_group = document.querySelectorAll('input[type="checkbox"]')
        , category_group = document.getElementsByClassName('category-group__folder')
        , search_input   = $('#q')

    const redux_category = JSON.parse(localStorage.redux_category || '[]')

    for (let i = 0; i < redux_category.length; i++) {
      if (i < 70) {
        checkbox_group[i].checked = redux_category[i]
      }
     if (i > 69 && i < 77) {
        if (redux_category[i]) {
          $(category_group[i-70]).addClass('full')
        }
      }
      
      if (i == 77) {
        search_input.val(redux_category[i])
      }
    }
  })()


  $('#donate_hide').on('click', () => {
    $('.donate').animate({ height: '0px' })
  })

  $('#notify').on('click', () => {
    if($('#notify').prop('checked')) {
    }
    redux_category()
  })

  $('.tnx').on('click', function(){ 
    $('.donate').animate({ height: '366px' })
  })

  $('.donate_info').on('click', () => {
    window.open("https://jsusdev.github.io/home-page/donate.html","_blank")
  })

  $('.github_info').on('click', () => {
    window.open("https://github.com/JsusDev/Freelansim","_blank")
  })

  $('.telegram_me').on('click', () => {
    window.open("https://t.me/jsusdev","_blank")
  })

  $('.telegram_channel').on('click', () => {
    window.open("https://t.me/jsusdevs","_blank")
  })
  
  $('.github_me').on('click', () => {
    window.open("https://github.com/JsusDev","_blank")
  })

})



