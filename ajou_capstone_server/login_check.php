<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <!--이 php는 main으로부터 넘어옵니다. 그 후 값을 CHECK해 올바른 값이 들어오는지 아닌지를 확인 후 들어온다면 다음 step으로, 아니라면 이전 step을 반복하도록 합니다.-->
    <title>Login Check</title>
    <style>
      #ogin{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: rgba(0,0,0,0); color: skyblue; padding: 5px; }
      #ogin:hover{ color:white; background-color: skyblue; }
      body {
        font-family: Consolas, monospace;
        font-family: 12px;
      }
      #ogin2{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: rgba(0,0,0,0); color: skyblue; padding: 5px; }
      #ogin2:hover{ color:white; background-color: skyblue; }
      body {
        font-family: Consolas, monospace;
        font-family: 12px;
      }
      table {
        width: 100%;
      }
      th, td {
        padding: 10px;
        border-bottom: 1px solid #dadada;
        text-align: center;
      }
    </style>
    <!--Style은 이전의 형식과 유사한 부분이 많습니다.-->
  </head>
  <body>
  	<?php 
        $ID = $_POST['ID'];
        $Password = $_POST['Password'];
        /* POST를 통해 FORM으로 들어온 ID와 Password를 받습니다. 이렇게 받은 값을 $ID와 $Password에 저장하도록 합니다. */

        if($ID == NULL || $Password == NULL){ 
        	echo "<script>alert(\"아이디, 또는 Password를 입력하지 않았습니다.\");</script>";
			echo "<script>location.href='main.php'</script>";
        /* NULL 값이 들어올 경우의 처리입니다. alert로 메시지를 띄운 후 location.href를 통해 메인으로 돌아가도록 처리합니다.*/
        }
        else{
		// DB를 설정합니다.
		$dbhost = '27.96.131.37'; 
		$dbuser = 'hong'; 
		$dbpass = 'ckwjdgus'; 
		$dbname = 'trap'; 

		//DB를 연결합니다. 
		$dblink = new mysqli($dbhost, $dbuser, $dbpass, $dbname); 

		//연결이 성공했는지 확인합니다.
		if ($dblink->connect_errno) { 
			printf("Failed to connect to database"); 
			exit(); 
			}
	
		//login 값을 result로 불러옵니다. 
		$result = $dblink->query("SELECT * FROM admin"); 

		//값을 저장할 배열 변수를 만듭니다.
		$dbdata = array(); 

		//result의 값을 한 줄씩 dbdata 배열에 저장합니다.
		while ( $row = $result->fetch_assoc()) { 
			$dbdata[]=$row;
			}

		$j = 0;

		//ID와 Password가 DB랑 일치한지를 확인합니다.
		while($j<count($dbdata)){
			if($dbdata[$j][ID] == $ID){
				if($dbdata[$j][Password] == $Password){
					break;
				}
			}
			$j++;
		}
		if($j == count($dbdata)){
			//일치하지 않다면, 즉 dbdata가 끝까지 읽혔다면, main으로 돌아가며 해당 사항을 알립니다.
        	echo "<script>alert(\"아이디, 또는 Password가 올바르지 않습니다.\");</script>";
			echo "<script>location.href='main.php'</script>";
		}
		else{
        	echo "<script>alert(\"신고 페이지로 입장합니다.\");</script>";
			echo "<script>location.href='singo.php'</script>";

		}
	}
  	 ?>
  </body>
</html>