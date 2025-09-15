// contato.js — abas + validação + sucesso (refactor limpo)
(function(){
  // ===== Abas =====
  var btnSug  = document.getElementById("btn-sugestao");
  var btnRed  = document.getElementById("btn-redes");
  var secSug  = document.getElementById("sugestao");
  var secRed  = document.getElementById("redes");
  var doneBox = document.getElementById("sucesso-envio");

  function setSelected(which){
    var redes = which === "redes";
    if(btnSug) btnSug.setAttribute("aria-selected", String(!redes));
    if(btnRed) btnRed.setAttribute("aria-selected", String(redes));
  }
  function show(which){
    var redes = which === "redes";
    if(secSug){ secSug.hidden = redes;  secSug.style.display = redes ? "none"  : "block"; }
    if(secRed){ secRed.hidden = !redes; secRed.style.display = redes ? "block" : "none"; }
    if(doneBox){ doneBox.hidden = true; doneBox.style.display = "none"; }
    setSelected(which);
    if(history && history.replaceState){
      history.replaceState(null, "", "#" + which);
    }else{
      location.hash = "#" + which;
    }
  }
  btnSug && btnSug.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); show("sugestao"); });
  btnRed && btnRed.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); show("redes"); });

  function initFromHash(){
    var h = (location.hash || "").toLowerCase();
    show(h.indexOf("redes") !== -1 ? "redes" : "sugestao");
  }
  document.addEventListener("DOMContentLoaded", initFromHash);
  window.addEventListener("hashchange", initFromHash);

  // ===== Validação do Form =====
  var form     = document.getElementById("form-sugestao");
  var nome     = document.getElementById("nome");
  var email    = document.getElementById("email");
  var sugestao = document.getElementById("sugestao-texto");

  function ensureErrorBox(input){
    if(!input) return null;
    var holder = input.parentElement;
    if(!holder) return null;
    var box = holder.querySelector(".field-error");
    if(!box){
      box = document.createElement("div");
      box.className = "field-error";
      holder.appendChild(box);
    }
    return box;
  }
  function setError(input, msg){
    if(!input) return;
    var box = ensureErrorBox(input);
    if(!box) return;
    box.textContent = msg || "";
    box.style.display = msg ? "block" : "none";
    if(msg) input.setAttribute("aria-invalid","true");
    else    input.removeAttribute("aria-invalid");
  }

  var minNome = 2, minSug = 20;

  function validate(){
    var ok = true;

    var n = (nome && nome.value || "").trim();
    if(n.length < minNome){ setError(nome, "O nome precisa ter pelo menos " + minNome + " caracteres."); ok = false; }
    else setError(nome, "");

    var e = (email && email.value || "").trim();
    if(!e.includes("@") || !/^\S+@\S+\.\S+$/.test(e)){ setError(email, 'Informe um e-mail válido (deve conter "@").'); ok = false; }
    else setError(email, "");

    var s = (sugestao && sugestao.value || "").trim();
    if(s.length < minSug){ setError(sugestao, "A sugestão precisa ter pelo menos " + minSug + " caracteres."); ok = false; }
    else setError(sugestao, "");

    return ok;
  }

  [nome, email, sugestao].forEach(function(el){
    if(!el) return;
    el.addEventListener("input", validate);
    el.addEventListener("blur", validate);
  });

  function showSuccess(){
    if(secSug){ secSug.hidden = true; secSug.style.display="none"; }
    if(secRed){ secRed.hidden = true; secRed.style.display="none"; }
    if(doneBox){ doneBox.hidden = false; doneBox.style.display="block"; doneBox.scrollIntoView({behavior:"smooth", block:"center"}); }
  }

  form && form.addEventListener("submit", function(ev){
    ev.preventDefault();
    if(!validate()) return;
    showSuccess();
    form.reset();
  });

  // Ações do painel de sucesso
  document.addEventListener("click", function(ev){
    var nova = ev.target.closest("#nova-sugestao");
    var redes= ev.target.closest("#ir-redes");
    if(nova){
      ev.preventDefault();
      if(doneBox){ doneBox.hidden = true; doneBox.style.display="none"; }
      show("sugestao");
      nome && nome.focus();
    }
    if(redes){
      ev.preventDefault();
      if(doneBox){ doneBox.hidden = true; doneBox.style.display="none"; }
      show("redes");
    }
  });
})();

// -- BIND TABS (garante funcionamento dos botões) --
document.addEventListener('DOMContentLoaded', function(){
  var btnSug = document.getElementById('btn-sugestao');
  var btnRed = document.getElementById('btn-redes');
  var sug    = document.getElementById('sugestao');
  var red    = document.getElementById('redes');

  function selectTab(which){
    var isRed = which === 'redes';
    if(sug){ sug.hidden = isRed;  sug.style.display = isRed ? 'none'  : 'block'; }
    if(red){ red.hidden = !isRed; red.style.display = isRed ? 'block' : 'none'; }
    if(btnSug){ btnSug.setAttribute('aria-selected', String(!isRed)); btnSug.classList.toggle('btn', !isRed); btnSug.classList.toggle('btn-secondary', isRed); }
    if(btnRed){ btnRed.setAttribute('aria-selected', String(isRed));  btnRed.classList.toggle('btn', isRed);  btnRed.classList.toggle('btn-secondary', !isRed); }
  }

  if(btnSug){
    btnSug.addEventListener('click', function(e){ e.preventDefault(); selectTab('sugestao'); history.replaceState(null,'','#sugestao'); });
  }
  if(btnRed){
    btnRed.addEventListener('click', function(e){ e.preventDefault(); selectTab('redes'); history.replaceState(null,'','#redes'); });
  }

  // Estado inicial
  var h = (location.hash||'').toLowerCase();
  selectTab(h.includes('redes') ? 'redes' : 'sugestao');
});
