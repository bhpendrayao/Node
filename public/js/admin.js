const deleteProduct = (btn)=>{
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;

    const productelement=btn.closest('article');

    fetch('/admin/product/'+prodId,{
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        console.log(result);
    }).then(data=>{
        console.log(data);
        productelement.parentNode.removeChild(productelement);
    }).catch(err=>{
        console.log(err);
    });
};