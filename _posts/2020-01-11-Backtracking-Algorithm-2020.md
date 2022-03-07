---
layout:       post
title:        浅入深出回溯法
subtitle:     因为当初学的时候没找到好资料所以自己写了一份！
date:         2020-01-11
auther:       BlackDn
header-img:   img/acg.gy_28.jpg
catalog:      true
tags:
    - SchoolClass
    - Algorithm
---

>"等风来，不如追风去。"

# 前言
也是一篇拖了好久的博客...感激在今天之内踩线发QwQ    
世上算法千千万，为什么要写回溯法呢  
因为这玩意真的搞得我头疼，花了我快一整天的时间  
主要是网上的博客千篇一律，不如直接做题  
我是题目做多了后感受到了回溯法的套路，所以就想来写一篇更加详细的博客啦  
# 回溯法
关于回溯法的博客有很多很多，但总是先上来给你讲什么是回溯法，然后直接扔题，什么八皇后问题，数独问题。然后代码糊你脸上就完事  
看的我是挺无语的  
一开始不知道什么是回溯法还能看看，知道什么是回溯法后却不知道代码是怎么写出来的所以仍然一头雾水  
这就是回溯法给我的印象：**它是个很好理解，上手很难，但熟悉后很又很简单的算法**  
### 什么是回溯法
#### - 我的理解
按照惯例还是先讲理论。当然你可以跳过这里，直接去下面一步步跟着写代码。  
多做两道题后就会发现回溯法是有自己固定的套路的，就可以自己写题啦  
  
用一句话来讲，回溯法是优化后的穷举法。我称之为 **“有脑穷举”**，将其和暴力的无脑穷举区分  
**有脑**体现在哪里呢？  
暴力穷举之所以无脑，是因为不管当前情况是否符合，我先试了再说。而回溯法会在每次选择前进行判断，当此时的情况不满足某些条件的时候，就放弃当前情况及其后续的情况，换下一种情况。  
以**数独问题**为例：  
暴力穷举很简单啊，每个空格0-9的数字试一遍总会有解，但这样的次数就会很庞大。而回溯法则在每次填数字的时候判断，当前行、当前列或者当前九宫格是否有这个数字了，有就不填换下一个数字判断，没有才填上这个数然后看下一个空格。  
若是0-9都不行，那就回到上一个空格，换下一个数字填。这就是**回溯**的由来。  
当然要是没有上一个空格，即第一个空格0~9都不能填，那就是题目无解，回溯法不背锅。  
在做选择前先判断，先过脑子，就能很大程度上避免许多无意义的穷举，提高其效率。  
#### - 专业解析
知道回溯法了后，我们开始看看那些高级的专业名词  
**“判断是否满足某些条件”** 这个步骤是回溯法区别于暴力穷举的一个特点，我们将它拿出来，称之为**约束函数**  
而既然需要回溯，那么就需要记录上一个情况的状态（数据），一个非常简单的做法，也是我们通常采用的做法，是利用**递归**，递归栈的特点能够很好地帮我们保存上一个情况的状态（数据）。而从数独问题我们可以看到，我们选择了一个空格后，进而考虑的是下一个空格，而不是当前空格的下一个情况，即利用的是**深度优先搜索**而不是广度优先搜索。深搜通常也有递归调用，因此回溯法通常采用深搜，既能穷举，又有递归。  
### 细致解题
#### 解题套路
之前也说过，回溯法的题目做多了会有一个套路，我尝试着把这个套路写出来，然后咱根据套路一步步去解题  
用回溯法解题，因为需要**深搜+递归**，所以通常写一个函数进行调用，然后变量都用全局变量，这样才好在递归的时候进行比较判断  

1. 定义全局变量：基本上所有的变量都是全局变量，大致包括输入数据、当前解、最优解等。不用一下子就全写出来的，如果之后发现有用到新的变量可以回头来定义。  
2. 编写递归函数：内容包括**出现可行解时进行处理**、**判断是否可选**、**选择、递归、取消选择**  
3. 初始化和递归调用：其实就是在main函数中输入数据然后调用递归函数

#### 例题（C++实现）
让我先找个例题  

```
5-2 工作分配问题 (50分)
设有n件工作分配给n个人。将工作i分配给第j个人所需的费用为cij 。 设计一个算法，对于给定的工作费用，为每一个人都分配1件不同的工作，并使总费用达到最小。

输入格式:
输入数据的第一行有1个正整数n (1≤n≤20)。接下来的n行，每行n个数，表示工作费用。
输出格式:
将计算出的最小总费用输出到屏幕。

输入样例:
在这里给出一组输入。例如：
3
10 2 3
2 3 4
3 4 5
输出样例:
在这里给出相应的输出。例如：
9
```
然后咱开始跟着套路来一步步解题
###### 1. 定义全局变量
显然一开始我们需要一个n代表人数/任务，需要一个currentPrice表示当前解即当前费用，minPrice表示最优解即目前已知的最少费用  
然后为了方便我们进行任务分配，定义一个isAssigned[]数组表示任务是否被分配  
还需要一个二维数组price[][]来表示价格，第i行第j列表示第i个工作分配给第j个人所需要的费用  
当然有些变量一开始没想到，后面要用到的时候重新回来定义就好  

```
int n;  //n个人/任务
int minPrice = 0;   //最少费用
int currentPrice = 0;   //当前费用
bool isDone[30];    //这个任务是否被分配了 
int price[30][30];  //存储价格 
```
###### 2. 编写递归函数
既然是回溯法我们就给递归函数命名为Backtrack  
给一个参数 t 表示为第 t 个人分配工作（由于这题一个人对应一个工作，一个工作对应一个人，所以也可以用第t个工作表示t，我以第t个人为例）  
```
void Backtrack(int t)
```
第一步**出现可行解时进行处理**，表示当前情况已经到头了，已经出现了一个可行解。我们通常的处理方法是将这个可行解和已知的最优解比较，选取更优的那个。  
在这道题中，表示我已经将所有人都分配了一个工作，要比较当前费用currentPrice和目前已知的最少费用minPrice，把小的那个赋值给minPrice  

```
if (t >= n) {
        if (currentPrice < minPrice) {
            minPrice = currentPrice;
            return;
        }
    }
```  
  
第二步**判断是否可选**，这就是回溯法在选择前进行的有脑判断了。通常是当前费用加上我想选的费用和最少费用minPrice进行比较。如果当前加上我想选的必已知最优解都差劲那我还选他干嘛  
要注意的是，由于我的参数t表示第t个人，在二维数组中表示第t行。在判断中还要一个循环将所有工作遍历一遍(其实就是遍历第t行)，用isDone[]判断这个工作是否已经被分配了。被分配的工作自然不用再选了。  

```
 if (currentPrice < minPrice) {
        for (int i = 0; i < n; i++) {
            //如果工作i没有被分配，则分配给t，分配下一个工作 
            if (!isDone[i]) {

            }
        } 
    } 
```
  
第三步**选择、递归、取消选择**  
**选择**：既然我们选择了，也就是为第t个人选择了这个工作，那么要做的就是将这个工作的前加到currentPrice中，并且修改isDone[]中对应工作的值  
**递归**：要记得我们是深搜，为t个人选了工作后给下一个人（t+1）分配工作，而不是看t个人的下一个工作  
**取消选择**：这里可能比较难理解。但是要注意，这一步在递归后面，意味着递归结束后才执行。说明为t分配当前这个工作的情况已经走完了，至于有没有可行解不是这一段代码要考虑的所以我们也不管他。我们要做的是撤销上面选择进行的操作，为第t个人循环选择下一个工作作铺垫  
  
举个例子，选择表示第1个人选择了第1个工作，递归的作用是为第2、3...n个人选工作寻找可行解，不管有没有可行解都要回到第1个人，因为他还有第2、3...n个工作可以尝试选取。取消选择的作用就是撤销他选择第1个工作带来的变化。因为整个过程在循环中，所以接下来就可以给第1个人分配第2个工作  
  通常**取消选择**是**选择**的**逆操作**所以整个第三步是**关于递归对称的**  

```
    isDone[i] = true;
    currentPrice += price[t][i]; 
    Backtrack(t + 1);
    currentPrice -= price[t][i];    //回溯
    isDone[i] = false;      //回溯 
```  
  
整合起来就是整个Backtrack()方法  

```
void Backtrack(int t) {
    //到达叶子结点 
    if (t >= n) {
        if (currentPrice < minPrice) {
            minPrice = currentPrice;
            return;
        }
    }
    
    //如果当前价格小于之前的最少费用则继续往下选择，否则该子树没有继续选择的必要 
    if (currentPrice < minPrice) {
        for (int i = 0; i < n; i++) {
            //如果工作i没有被分配，则分配给t，分配下一个工作 
            if (!isDone[i]) {
                isDone[i] = true;
                currentPrice += price[t][i]; 
                Backtrack(t + 1);
                currentPrice -= price[t][i];    //回溯
                isDone[i] = false;      //回溯 
            }
        } 
    } 
}

```
###### 3. 初始化和递归调用
到了这一步就很简单了，将题目给的数据输入，然后调用递归函数，最后输出结果就好了  

```
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j ++) {
            cin >> price[i][j];
            minPrice += price[i][j];    //初始化minPrice为一个很大的值 
        }
    }
    
    Backtrack(0);
    
    cout << minPrice; 
    return 0;
} 
```
将数据存到我们之前定义的全局变量中就好，让递归函数自己去操作数据  
上面的minPrice也可以直接赋值一个很大的数，代表正无穷，以此来初始化  
###### 源码
最后给出完整代码，再整理一下思路，看看结构  
几乎所有的回溯法题目都能通过上述步骤进行解题

```
#include <iostream>
#include <stdio.h>
#include <string.h>
#include <math.h> 
#include <algorithm>

using namespace std;

int n;  //n个人/任务
int minPrice = 0;   //最少费用
int currentPrice = 0;   //当前费用
bool isDone[30];    //这个任务是否被分配了 
int price[30][30];  //存储价格 

//第t个人进行选择，即t为行号 
void Backtrack(int t) {
    //到达叶子结点 
    if (t >= n) {
        if (currentPrice < minPrice) {
            minPrice = currentPrice;
            return;
        }
    }
    
    //如果当前价格小于之前的最少费用则继续往下选择，否则该子树没有继续选择的必要 
    if (currentPrice < minPrice) {
        for (int i = 0; i < n; i++) {
            //如果工作i没有被分配，则分配给t，分配下一个工作 
            if (!isDone[i]) {
                isDone[i] = true;
                currentPrice += price[t][i]; 
                Backtrack(t + 1);
                currentPrice -= price[t][i];    //回溯
                isDone[i] = false;      //回溯 
            }
        } 
    } 
}

int main() {
    cin >> n;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j ++) {
            cin >> price[i][j];
            minPrice += price[i][j];    //初始化minPrice为一个很大的值 
        }
    }
    
    Backtrack(0);
    
    cout << minPrice; 
    return 0;
} 
```
#### 深入了解
看懂了代码是怎么出来的后，我们对回溯法进一步了解，还有很多专业名词等着我们呢  
由于回溯法利用深度优先搜索，自然能想到**树的结构**  
既然所有回溯法都是利用深度优先搜索实现的，那么是不是所有回溯法的题目都能表示为树的结构呢？其实是可以的，而这个树就叫做**解空间树**  
利用回溯法求解，求解的过程就是对这棵树进行深度优先搜索，每到一个叶子结点，就是一个解，我们习惯遍历整棵树，找到最优的那个解  
  
以我们这题为例，它的解空间树应该是一个n层n叉的树。每一层表示某个人，而所走的结点表示其选择的工作。回溯的过程就是对这个树进行深搜。判断第一个人选第一个工作，第二个人选第二个工作....第一个人选第二个工作，第二个人选第一个工作...等等所有情况  
  
根据不同的解空间树，我们可以将回溯法的题目分为以下三类：  
1. 第一类是从一个大集合中，选出符合条件的最优解，比如0-1背包问题、子集和问题。可以发现在这类题目中，并非所有的元素都需要选择。因此，对于每个元素，我们都有选和不选两种可能，因此其解空间树是一颗**二叉树**，又称为**子集树**。每层表示一个元素，左子树和右子树分别表示选或者不选当前元素（当然也可以反过来）。
2. 第二类则是对于每个元素，我们必须要给每个元素分配一种情况，当然一个元素可选的情况通常有很多种。就比如数独问题，对于每个元素（空格），我们都有0~9十种选项可供分配，我们仍用元素代表每一层，俺么解空间树自然是一颗10叉树。自然，在这类问题下，其解空间树是一颗**n叉树**，也称为**排列数**
3. 第三类则属于其他类，既不是子集树也不是排列数，比如拆分整数，需要具体问题具体分析。

在更复杂的题目，或者说对时间要求更高的题目中，需要进行**剪枝**来去除不可能的情况。剪枝是回溯法的精髓所在，也是我认为的难点所在。  
剪枝通常包括**界限函数**和**约束函数**。界限函数将忽略得不到最优解的子树，约束函数则剪去不满足约束条件的子树（跳过不满足某些条件的情况）  
  
比如在0-1背包问题中，我们在选择某项物品前先判断选择该物品会不会使背包超重，超重就不选，这属于**约束函数**，约束条件就是背包的载重。同时，我们将目前背包剩余重量和剩下没选好的物品进行贪心求解，最后加上目前背包里的价值，即得出当前情况下能得到的最多价值（当前价值+未来能得到的最多价值 [靠贪心求得] ）；然后将这个值和当前的最优解进行比较，当且仅当未来最多价值比最优解大的时候我们才继续向下遍历这颗子树。  
道理很简单：既然未来最多价值比之前我求得的某个最优解小，那么即使我有解（到达叶子结点），也肯定不是最优解，那就没有继续遍历这棵树的必要了。这就属于**界限函数**。
  
纵观全局，你会发现回溯法的代码总是由三部分组成（头文件自己写！）：
1. 全局变量
2. 回溯函数
3. 主函数