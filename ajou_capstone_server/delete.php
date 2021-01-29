<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <title>삭제</title>
    <style>
      body {
        font-family: Consolas, monospace;
        font-family: 12px;
      }
    </style>
  </head>
  <body>
    <?php
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
          $delete_emp_no = $_POST[ 'delete_emp_no' ];
          if ( isset( $delete_emp_no ) ) {
              $jb_sql_delete = "DELETE FROM report WHERE idreport = '$delete_emp_no';";
              mysqli_query( $jb_conn, $jb_sql_delete );
        			$jb_sql_delete2 = "ALTER TABLE report AUTO_INCREMENT=1;";
        			mysqli_query($jb_conn, $jb_sql_delete2); 
        			$jb_sql_delete3 = "SET @COUNT = 0;";
        			mysqli_query($jb_conn, $jb_sql_delete3);
        			$jb_sql_delete4 = "UPDATE report SET idadmin = @COUNT:=@COUNT+1;";
        			mysqli_query($jb_conn, $jb_sql_delete4);
          }
		  mysqli_close($jb_conn);
  echo "<script>alert(\"삭제가 완료되었습니다.\");</script>";
  echo "<script>location.href='singo.php'</script>";
    ?>
  </body>
</html>