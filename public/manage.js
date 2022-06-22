let deleteButtons = document.querySelectorAll('.delete')

deleteButtons.forEach((button)=>{
    console.log(button)
    button.addEventListener('click', ()=>{
        let id = button.parentNode.childNodes[4].dataset.id
        console.log(id, button.parentNode.childNodes)
        fetch("deleteTask", {
            method:"delete",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                id:id
            })
          })
          .then(()=>{
              window.location.reload(true)
          })
    })
})