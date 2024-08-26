# counter

ton 练习

参考文章：http://tonhelloworld.com/02-contract/

# 部署
需要在根目录创建一个 .env 文件，填写助记词内容如下：
```
MNEMONIC=minute year day ...
```

编译：npx func-js contracts/counter.fc --boc build/counter.cell

部署：npx blueprint run