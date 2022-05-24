# TechAlchemy-Task
**Task-1**
**Answer** : Here, we have limited range of memory, whereas data given is 10x bigger than operational available memory. so here what I think is data divided into temporary files of equal to the size of the RAM and then operate data through 'external sorting' which uses merging technique. 

What exactly external sorting do?
Explanation:  External sorting is a term for a class of sorting algorithms that can handle massive amounts of data. External sorting is required when the data being sorted do not fit into the main memory of a computing device (usually RAM) and instead, they must reside in the slower external memory (usually a hard drive).We first divide the file into runs such that the size of a run is small enough to fit into main memory. Then sort each run in main memory using merge sort sorting algorithm. Finally merge the resulting runs together into successively bigger runs, until the file is sorted.

This can be done as follows: Pseudocode
1. Divide the data into equal groups of size from 1 GB.
2. Read 1 GB of the data in main memory and sort by some conventional sorting method, like mergesort.
3. Sort each group and write the sorted data to disk.
4. Repeat steps 2 and 3 until all(1 Gb data group) is not sorted 
5. Output the smallest item from the main memory to disk. Load the next item from the group whose item was chosen.
6. Loop step #5 until all items are not outputted.

The step 4-6 is called as merging technique.


**Task-2**
First open your Terminal and clone this project from below command

    command: git clone https://github.com/snehallodaliya/TechAlchemy.git

open that folder in any editor (like vscode, webstorm etc..)
Once clone process is completed successFully then checkout the branch master

    command: npm i

Now, after installing dependencies create one **".env"** file from **".env.test"** file (copy content from **'.env.test'** to **'.env'**)

Now run the command **"npm start"** or go to in **"/src"** directory and then fire command **"node index.js"** (both working..)

**Postman documentation link** : https://www.getpostman.com/collections/2301ab99e2b4df8cf8ea

Some prerequisite for successful run this project:

Start mongoDb service in your system at local-server(127.0.0.1:27017)

