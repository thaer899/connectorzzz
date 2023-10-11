tree ./ /f /a > output.txt


tree /f /a | findstr /i /v /b /c:"[|]-----node_modules" /c:"[|]-----dist" > output.txt
