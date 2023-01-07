/*

TemplateMo 559 Zay Shop

https://templatemo.com/tm-559-zay-shop

*/

'use strict';
$(document).ready(function() {

    // Accordion
    var all_panels = $('.templatemo-accordion > li > ul').hide();

    $('.templatemo-accordion > li > a').click(function() {
        console.log('Hello world!');
        var target =  $(this).next();
        if(!target.hasClass('active')){
            all_panels.removeClass('active').slideUp();
            target.addClass('active').slideDown();
        }
      return false;
    });
    // End accordion

    // Product detail
    $('.product-links-wap a').click(function(){
      var this_src = $(this).children('img').attr('src');
      $('#product-detail').attr('src',this_src);
      return false;
    });
    
    
    
    $('.btn-size').click(function(){
      var this_val = $(this).html();
      $("#product-size").val(this_val);
      $(".btn-size").removeClass('btn-secondary');
      $(".btn-size").addClass('btn-dark');
      $(this).removeClass('btn-dark');
      $(this).addClass('btn-secondary');
      return false;
    });
    // End roduct detail

});

function btn_minus(id){
  var val = $("#"+id).html();
  val = (val=='1')?val:val-1;
  $("#"+id).html(val);
  $("#product-quanity").val(val);
  
}

function btn_plus(id){
  var val = $("#"+id).html();
  val++;
  $("#"+id).html(val);
  $("#product-quanity").val(val);
  return false;
}