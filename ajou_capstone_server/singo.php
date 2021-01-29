<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <title>신고 페이지</title>
    <link href="http://fonts.googleapis.com/earlyaccess/jejugothic.css" rel="stylesheet">
    <style>
      #edit{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: rgba(0,0,0,0); color: skyblue; padding: 5px; }
      #edit:hover{ color:white; background-color: skyblue; }
      #delete{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: rgba(0,0,0,0); color: skyblue; padding: 5px; }
      #delete:hover{ color:white; background-color: skyblue; }
      #add{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: skyblue; color: white; padding: 5px; }
      #add:hover{ color:skyblue; background-color: white; }
      #ssample{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: skyblue; color: white; padding: 5px; }
      #ssample:hover{ color:skyblue; background-color: white; }
      #tsample{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: skyblue; color: white; padding: 5px; }
      #tsample:hover{ color:skyblue; background-color: white; }
    .jg{font-family: 'Jeju Gothic', sans-serif;}
      table {
        width: 100%;
        margin-bottom: 40px;
      }
      th, td {
        padding: 8px;
        border-bottom: 1px solid #dadada;
        text-align: center;
      }
      form{
        display: inline;
      }
      #footer {  
        position:fixed; 
        left:20px; 
        bottom:40px; 
        height:0px; 
        width:100%; 
     }
    </style>
  </head>
  <body>
    <h1 align="center" style="color:skyblue">신고 페이지</h1>
    <table>
      <thead>
        <tr>
          <!--신고 리스트를 보여주는 가장 좋은 방식으로 table을 만든다. table의 style은 위의 style을 통해 지정할 수 있도록 한다.-->
          <th>신고 유저</th>
          <th>해당 유저</th>
          <th>신고 내용</th>
          <th>코멘트</th>
          <th>날짜</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
      <?php
        // 접근을 체크한다. 만약 접근이 이전부터 이어져 오는 것이 아니라 URL을 통한 바로 접근일 시 에러 코드와 함께 메인으로 이동시킨다. 이 형태의 코드는 앞으로의 전반에 동일하게 존재하도록 한다.
        $chk_url = $_SERVER['HTTP_REFERER'];
        $chk_domain = $_SERVER['SERVER_NAME'];
        if(!strstr($chk_url,$chk_domain)){
          echo "<script>alert(\"잘못된 접근입니다.\");</script>";
          echo "<script>location.href='main.php'</script>";
          exit;
        }
          $jb_conn = mysqli_connect(
          '27.96.131.37',
          'hong',
          'ckwjdgus',
          'trap');
          $jb_sql = "SELECT * FROM report;";
          $jb_result = mysqli_query( $jb_conn, $jb_sql );
          while( $jb_row = mysqli_fetch_array($jb_result)){
            $jb_delete = '
              <form action="delete.php" method="POST">
                <input type="hidden" name="delete_emp_no" value="' . $jb_row['idreport'] . '">
                <input id = "delete" type="submit" value="삭제하기">
              </form>
            ';
            echo '<tr><td>' . $jb_row[ 'id' ] . '</td><td>' . $jb_row[ 'toid' ] . '</td><td>' . $jb_row[ 'type' ] . '</td><td>' . $jb_row[ 'comment' ] . '</td><td>' . $jb_row[ 'date' ] . '</td><td>' . $jb_delete . '</td></tr>';
          }

      ?>
      </tbody>
    </table>
  </body>
</html>