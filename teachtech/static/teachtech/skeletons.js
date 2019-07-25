




function getSpinner(){
    let center = document.createElement('div');
    center.classList.add('d-flex');
    center.classList.add('justify-content-center');
    let spinner = document.createElement('div');
    spinner.classList.add('spinner-border');
    spinner.classList.add('m-5');
    
    center.appendChild(spinner);
    return center;
}