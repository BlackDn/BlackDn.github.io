---
layout:   post
title:    电子电路的一些题解
subtitle:  电子电路期末复习的产物
date:   2019-06-23
auther:   BlackDn
header-img:   img/acg.gy_19.jpg
catalog:    true
tags:
      - Summary
      - ElectronicCircuit 
---
> "星河滚烫，你是人间理想"

# 前言
电子电路复习做样卷的题目有些真的不是很会，就花时间总结了下自己的方法
感谢那些不嫌弃我字丑画图歪歪扭扭还认认真真看我博客的人
2019-06-24  更新，下午考试，临时抱佛脚QAQ
# 电子电路的一些解题方法
## 判断二极管类型
判断二极管主要从两个方面：
1. 硅管还是锗管
2. PNP还是NPN

#### 硅管还是锗管
将二极管两个数值最接近的电压相减，若**结果为0.2，则为锗管**；若**结果为0.7，则为硅管**
#### PNP还是NPN
判断完是什么管后，两个相减的电压分别为B极、E极  
看第三个点压。如果**第三个电压大于之前的两个，则为NPN型**，之前的两个电压大的为B极，小的为E极  
如果**第三个电压小于之前的两个，则为PNP型**，之前的两个电压大的为E极，小的为B极
## 相量表示
相量形式的定义可以参考博客：[正弦信号与相量](https://blog.csdn.net/weixin_43314579/article/details/89382664)  
1. 转化为相量形式
2. 利用频率ω计算电容或电感的相量形式
3. 普普通通求电流电压，只不过将运算变为向量

#### 将正弦表达式转化为相量形式
1. 确定相量表示的是正弦还是余弦，比如一开始转化为相量的是余弦，最后结果出来的就是余弦
2. 将外面的系数保持不变（表示最大值），或者，将√2去掉（表示有效值）
3. 将括号中初相写入∠中

#### 向量的运算方式
看着看着，题目还是不会做，运算方法倒是有了特殊的理解，绝壁比书上简单。  
首先是三种向量形式的转换，书里的转换方式很复杂，大概是这样  
![tansfrom3](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_XiangLiang/tansfrom3.png?raw=true)  
但实际上，三种形式完全可以通过画图来解决。  
在**极型**和**指数型**中，a表示线的长度，θ表示与x轴正方向的角度  
而在**代数型**中，a1表示x轴方向的长度；j表示的是90°的θ，即y轴方向；a2表示有几个j，即y轴方向的长度  
具体方法看这个例题  
![example1](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_XiangLiang/example1.png?raw=true)  
## 解析法求静态工作点
静态工作点求的是**集电极输入电流Ic**和**集电极与发射极两端电压Uce**  
1. 判断哪个极是共用的
2. 判断三极管的状态：放大、饱和、截止
3. 若为截止，IB=0，iC=βIB≈0，Uce约等于Ucc
4. 若为饱和
5. 若为放大，**共射极**计算顺序为：Ib→Ic→Uce。Ib相当于IBQ，IBQ=（Ucc-Ube）/Rb。Ic=βIb。Uce=Ucc-Ic*Rc
**共基极**计算顺序为：Ie→Ib→Ic→Uce。Ie=（Ue-Ube）/Re。Ib=Ie/(β+1)。Ic≈Ie。Uce≈-[Ue-Ucc-Ic(Rc+Re)]

#### 三极管三种状态判断
所谓正偏就是P结点电势高,N结点电势低  
以NPN三极管为例，发射结e电势高于基极b，即为发射结正偏；集电结c电势低于基极b，即为集电结反偏
1. 放大区：发射结正偏，集电结反偏，iC=βIB
2. 饱和区：发射结和集电结均正偏。iC随uCE增大而增大，无放大作用。  
临界饱和：发射结正偏，集电结电压Uc=基极电压Ub  
3. 截止区：发射结点压过小（或反偏），集电结反偏。IB=0，iC=βIB≈0，Uce约等于Ucc

![ThreeState](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_XiangLiang/ThreeState.png?raw=true)  

## 晶体管放大电路求输入输出电阻
基本上都是先**静态分析**求rbe，因为输入电阻会用到rbe；再用微变等效电路**动态分析**求四个放大指标（电压增益、电流增益、输入电阻、输出电阻）
#### 共射极
1. 画直流通路，**静态分析**
2. 根据Ucc求UB，再求出IE=(UB-UBE)/Re；或，求IB=(Ucc=UBE)/Rb，再求Ic=βIB，IE=IB+Ic（目标是IE）
3. 根据IE求rbe（题目给出的公式）
4. 利用微变等效电路**动态分析**
5. 从电源处看进去，但要忽略电源，求等效电阻（Rb//rbe），即输入电阻
6. 将独立电源短路，从负载电阻看进去，但要忽略负载电阻，求等效电阻（ro=Rc），即输出电阻  

![EmissionExample](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_XiangLiang/EmissionExample.png?raw=true)  
#### 共集电极（射极跟随器）
1. 画直流通路，**静态分析**
2. 根据Ucc-UBE=IbRb+IERe，IE=(1+β)Ib，得出Ib
3. 求得IE=(1+β)Ib
4. 根据IE求rbe（题目给出的公式）
5. 利用微变等效电路**动态分析**
6. 从Rb前看进去，但要忽略Rb，求等效电阻ri'
7. Rb和ri'并联后即为输入电阻，ri=Rb//[rbe+（1+β）Re']=Rb//[rbe+（1+β）(Re//RL)]
8. 忽略负载电阻并额外添加电压源，利用KCL列出I，ro=I/U=rbeRe/[(1+β)Re+rbe]  
![CollectionExample](https://github.com/BlackDn/BlackDn.github.io/blob/master/img/Post_XiangLiang/CollectionExample.png?raw=true)  
