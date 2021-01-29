<!doctype html>
<!--main.php 입니다. 제일 처음 나오는 화면이며, 기본적인 Login 처리를 담당합니다.-->
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <title>Main Page</title>
<!--title은 위의 상태 바에서 나오는 이름을 뜻합니다.-->
    <style>
      #Login{ border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; margin-right:-4px; border: 1px solid skyblue; background-color: rgba(0,0,0,0); color: skyblue; padding: 5px; }
      #Login:hover{ color:white; background-color: skyblue; }
      body {
        font-family: Consolas, monospace, "맑은고딕", "돋움";
        font-family: 12px;
      }
    /*스타일은 기본적인 것과 hover로 나뉩니다. hover는 버튼에 마우스를 가져다 댈 시에 바뀌는 효과를 뜻합니다. 이 두 Login은 모두 form의 button을 뜻합니다.*/
    </style>
  </head>
  <body>
    <h1 align="center" style="color:skyblue">로그인</h1>
    <div align="center">
    <!--h1을 통해 기본 화면에 올라올 header를 만듭니다. div를 통해 align으로 위치를 정하고 분열한 form에서 id와 pw를 받아 submit으로 login_check.php로 보내는 역할을 수행하도록 합니다.-->
    <form enctype="multipart/form-data" action="login_check.php" method="POST" >
      <p>ID <input type="text" name="ID"/></p>
      <p>PW <input type="password" name="Password"/></p>
	  <input id = "Login" type="submit" value="로그인"/>
    </form>
  </div>
  </body>
</html>