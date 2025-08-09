#include <bits/stdc++.h>
using namespace std;


int main(){
    int mangchuso[10];
    int n,m = 0;
    cin>>n;
    int u = 0;
    for(int i = n;i>=1;i = i/10){
        m = i % 10;
        cout<<m<<"\n";
        mangchuso[u] = m;
        u++;
    }
    for(int i = 0;i<10;i++){
        cout<<mangchuso[i];
    }

}

