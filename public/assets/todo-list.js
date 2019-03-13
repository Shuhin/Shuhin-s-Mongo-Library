$(document).ready(function(){

  $('form').on('submit', function(){

      let title = $('form input');
      let author = $('form input');
      let publisher = $('form input');
      let photo_path = $('form input');
      var todo = {
        title: title.val(),
        author: author.val(),
        publisher: publisher.val(),
        photo_path: photo_path.val()
      };

      $.ajax({
        type: 'POST',
        url: '/todo',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });
  //
  // $('li').on('click', function(){
  //     var item = $(this).text().replace(/ /g, "-");
  //     $.ajax({
  //       type: 'DELETE',
  //       url: '/todo/' + item,
  //       success: function(data){
  //         //do something with the data via front-end framework
  //         location.reload();
  //       }
  //     });
  // });

});
