
// Sindre Hvidsten
 
/********************************\
| GLOBAL VARIABLE INITIALIZATION | 
\********************************/
var ingredients = [];
var allergenes = [];
var categories = [];
var selections = [];
var selectionCategories = [];

var inEdit = {
    course: {editName: ".edit_course", isEdit: []},
    ingredient: {editName: ".edit_ingredient", isEdit: []},
    allergene: {editName: ".edit_allergene", isEdit: []},
    category: {editName: ".edit_category", isEdit: []},
    selection: {editName: ".edit_selection", isEdit: []},
    selection_category: {editName: ".edit_selection_category", isEdit: []}
}

var darkMode = false;

$(document).ready(function() {
    init();

    /**************************\
    | INITIALIZATION FUNCTIONS | 
    \**************************/
    async function init() {
        // Using jquery when to wait for AJAX calls to finish before moving on with initilization, this is crucial for the autocomplete to work
        
        $.when(
            initAutocompletion()
        ).then(function() {
            initFunctionality();
            initModeSwitch();
        });
    }
    
    function initFunctionality() {
        initCourses();
        initIngredients();
        initAllergenes();
        initCategories();
        initSelections();
        initSelectionCategories();
        initAdminFunctions();
        initTabSwap();
    }

    async function initAutocompletion() {
        await updateIngredients();
        await updateIngredients();
        await updateAllergenes();
        await updateCategories();
        await updateSelections();
        await updateSelectionCategories();
    }

    function initAdminFunctions() {
        $("#add_course").on("click", addCourse);
        $("#add_ingredient").on("click", addIngredient);
        $("#add_allergene").on("click", addAllergene);
        $("#add_category").on("click", addCategory);
        $("#add_selection").on("click", addSelection);
        $("#add_selection_category").on("click", addSelectionCategory);
    }
    
    function initCourses() {
        initEdit("course");
        $(".remove_course").on("click", removeCourse);
        
        $(".add_ingredient_to_course").on("click", addIngredientToCourse);
        $(".remove_ingredient_from_course").on("click", removeIngredientFromCourse);

        $(".add_selection_to_course").on("click", addSelectionToCourse);
        $(".remove_selection_from_course").on("click", removeSelectionFromCourse);
        
        $(".edit_course_name").on("click", editCourseName);
        $(".edit_course_price").on("click", editCoursePrice);
        $(".edit_course_category").on("click", editCourseCategory);
        $(".edit_course_description").on("click", editCourseDescription);
        
        initAutocompleteCourses();

        setMode();
    }
    
    function initIngredients() {
        initEdit("ingredient");
        $(".remove_ingredient").on("click", removeIngredient);
        
        $(".add_allergene_to_ingredient").on("click", addAllergeneToIngredient);
        $(".remove_allergene_from_ingredient").on("click", removeAllergeneFromIngredient);

        $(".edit_ingredient_name").on("click", editIngredientName);

        initAutocompleteIngredients();

        setMode();
    }
    
    function initAllergenes() {
        initEdit("allergene");
        $(".remove_allergene").on("click", removeAllergene);

        $(".edit_allergene_name").on("click", editAllergeneName);

        setMode();
    }
    
    function initCategories() {
        initEdit("category");
        $(".remove_category").on("click", removeCategory);  

        $(".edit_category_name").on("click", editCategoryName);

        setMode();
    }
    
    function initSelections() {
        initEdit("selection");
        $(".remove_selection").on("click", removeSelection);

        $(".edit_selection_name").on("click", editSelectionName);
        $(".edit_selection_selection_category").on("click", editSelectionSelectionCategory);
        $(".edit_selection_ingredient").on("click", editSelectionIngredient);
        $(".edit_selection_price").on("click", editSelectionPrice);

        initAutocompleteSelections();

        setMode();
    }
    
    function initSelectionCategories() {
        initEdit("selection_category");
        $(".remove_selection_category").on("click", removeSelectionCategory);  

        $(".edit_selection_category_name").on("click", editSelectionCategoryName);

        setMode();
    }

    function initEdit(param) {
        var name = inEdit[param].editName;
        var isEdit = inEdit[param].isEdit;

        for (var i = 0; i < isEdit.length; i++) {
            if (isEdit[i] === true) {
                $(".hidden-default-" + param + "-" + i).css("display", "inline");
                $(".hidden-edit-" + param + "-" + i).css("display", "none");
            } else if (isEdit[i] === false) {
                $(".hidden-default-" + param + "-" + i).css("display", "none");
                $(".hidden-edit-" + param + "-" + i).css("display", "inline");
            }
        }

        $(name).css("display", "inline-block");
        $(name).on("click", function () {
            var id = $(this).prop("name").split("_")[1];
            var idInt = parseInt(id);

            if (isEdit[idInt] === true) {
                $(".hidden-default-" + param + "-" + idInt).css("display", "none");
                $(".hidden-edit-" + param + "-" + idInt).css("display", "inline");
                isEdit[idInt] = false;
            } else {
                $(".hidden-default-" + param + "-" + idInt).css("display", "inline");
                $(".hidden-edit-" + param + "-" + idInt).css("display", "none");
                isEdit[idInt] = true;
            }
        });
    }

    function initModeSwitch() {
        $("#dark-mode").on("click", function() {
            darkMode = true;
            setMode();
        });
        $("#light-mode").on("click", function() {
            darkMode = false;
            setMode();
        });
    }

    function initAutocompleteCourses() {
        setupAutocomplete(".course-edit-category-input", categories, "ca_name", "ca_id");
        setupAutocomplete(".ingredient-input", ingredients, "i_name", "i_id");
        setupAutocomplete(".selection-input", selections, "s_name", "s_id");
    }

    function initAutocompleteIngredients() {
        setupAutocomplete(".allergene-input", allergenes, "a_name", "a_id");
    }

    function initAutocompleteSelections() {
        setupAutocomplete(".selection-edit-selection-category-input", selectionCategories, "sc_name", "sc_id");
        setupAutocomplete(".selection-edit-ingredient-input", ingredients, "i_name", "i_id");
    }

    function initTabSwap() {
        $(".tab-swap").on("click", function () {
            var link = $(this).prop("name");
            $(".db_tab").css("display", "none");
            $("." + link + "_display").css("display", "block");
        });
    }

    /************************\
    | AJAX REQUEST FUNCTIONS | 
    \************************/
        // COURSES
    function addCourse() {
        $.get("/menu/add_course", function () {
            updateCourseDisplay();
        });
    }

    function removeCourse() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove the course '" + info[0] + "'?")) {
            $.get("/menu/remove_course", {c_id: info[1]}, function () {
                updateCourseDisplay();
            });
        }
    }

    function removeIngredientFromCourse() {
        var info = $(this).prop("name").split("_");
        
        if (confirm("Are you sure you want to remove this ingredient from the course?")) {
            $.get("/menu/remove_ingredient_from_course", {c_id: info[0], i_id: info[1]}, function () {
                updateCourseDisplay();
            });
        }
    }

    function addIngredientToCourse() {
        var c_id = $(this).prop("id").split("-")[1];
        var i_id = $("#autocomplete_ingredient-" + c_id).prop("name");
        $.get("/menu/add_ingredient_to_course", {c_id: c_id, i_id: i_id}, function () {
            updateCourseDisplay();
        });
    }

    function addSelectionToCourse() {
        var c_id = $(this).prop("id").split("-")[1];
        var s_id = $("#autocomplete_selection-" + c_id).prop("name");
        $.get("/menu/add_selection_to_course", {c_id: c_id, s_id: s_id}, function () {
            updateCourseDisplay();
        });
    }
    
    function removeSelectionFromCourse() {
        var info = $(this).prop("name").split("_");
        
        if (confirm("Are you sure you want to remove this selection from the course?")) {
            $.get("/menu/remove_selection_from_course", {c_id: info[0], s_id: info[1]}, function () {
                updateCourseDisplay();
            });
        }
    }

        // INGREDIENTS
    function addIngredient() {
        $.get("/menu/add_ingredient", function () {
            updateIngredientDisplay();

            $.when(
                updateIngredients()
            ).done(function () {
                initAutocompleteCourses();
                initAutocompleteSelections();
            });
        });
    }

    function removeIngredient() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove the ingredient '" + info[0] + "'?")) {
            $.get("/menu/remove_ingredient", {i_id: info[1]}, function () {
                updateIngredientDisplay();

                $.when(
                    updateIngredients()
                ).done(function () {
                    initAutocompleteCourses();
                    initAutocompleteSelections();
                });
            });
        }
    }

    function addAllergeneToIngredient() {
        var i_id = $(this).prop("id").split("-")[1];
        var a_id = $("#autocomplete_allergene-" + i_id).prop("name");
        $.get("/menu/add_allergene_to_ingredient", {i_id: i_id, a_id: a_id}, function () {
            updateIngredientDisplay();
        });
    }

    function removeAllergeneFromIngredient() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove this allergene from the ingredient?")) {
            $.get("/menu/remove_allergene_from_ingredient", {i_id: info[0], a_id: info[1]}, function () {
                updateIngredientDisplay();
            });
        }
    }

        // ALLERGENES

    function addAllergene() {
        $.get("/menu/add_allergene", function () {
            updateAllergeneDisplay();

            $.when(
                updateAllergenes()
            ).done(function () {
                initAutocompleteIngredients();
            });
        });
    }
    
    function removeAllergene() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove the allergene '" + info[0] + "'?")) {
            $.get("/menu/remove_allergene", {a_id: info[1]}, function () {
                updateAllergeneDisplay();

                $.when(
                    updateAllergenes()
                ).done(function () {
                    initAutocompleteIngredients();
                });
            });
        }
    }

        // CATEGORIES

    function addCategory() {
        $.get("/menu/add_category", function () {
            updateCategoryDisplay();

            $.when(
                updateCategories()
            ).done(function () {
                initAutocompleteCourses();
            });
        });
    }
    
    function removeCategory() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove the category '" + info[0] + "'?")) {
            $.get("/menu/remove_category", {ca_id: info[1]}, function () {
                updateCategoryDisplay();

                $.when(
                    updateCategories()
                ).done(function () {
                    initAutocompleteCourses();
                });
            });
        }
    }

        // SELECTIONS

    function addSelection() {
        $.get("/menu/add_selection", function () {
            updateSelectionDisplay();

            $.when(
                updateSelections()
            ).done(function () {
                initAutocompleteCourses();
            });
        });
    }
    
    function removeSelection() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove the selection '" + info[0] + "'?")) {
            $.get("/menu/remove_selection", {s_id: info[1]}, function () {
                updateSelectionDisplay();
                
                $.when(
                    updateSelections()
                ).done(function () {
                    initAutocompleteCourses();
                });
            });
        }
    }

        // SELECTION CATEGORIES

    function addSelectionCategory() {
        $.get("/menu/add_selection_category", function () {
            updateSelectionCategoryDisplay();

            $.when(
                updateSelectionCategories()
            ).done(function () {
                initAutocompleteSelections();
            });
        });
    }

    function removeSelectionCategory() {
        var info = $(this).prop("name").split("_");
        if (confirm("Are you sure you want to remove the selection category '" + info[0] + "'?")) {
            $.get("/menu/remove_selection_category", {sc_id: info[1]}, function () {
                updateSelectionCategoryDisplay();

                $.when(
                    updateSelectionCategories()
                ).done(function () {
                    initAutocompleteSelections();
                });
            });
        }
    }

    // EDIT FUNCTIONS
        // EDIT COURSE

    function editCourseName() {
        var c_id = $(this).prop("name");
        var c_name = $("#course-edit-name_" + c_id).val();
        $.get("/menu/edit_course_name", {c_id: c_id, c_name: c_name}, function () {
            updateCourseDisplay();
        });
    }

    function editCoursePrice() {
        var c_id = $(this).prop("name");
        var price = $("#course-edit-price_" + c_id).val();
        $.get("/menu/edit_course_price", {c_id: c_id, price: price}, function () {
            updateCourseDisplay();
        });
    }

    function editCourseCategory() {
        var c_id = $(this).prop("id").split("-")[1];
        var ca_id = $("#autocomplete_course_edit_category-" + c_id).prop("name");
        $.get("/menu/edit_course_category", {c_id: c_id, ca_id: ca_id}, function () {
            updateCourseDisplay();
        });
    }

    function editCourseDescription() {
        var c_id = $(this).prop("name");
        var description = $("#course-edit-description_" + c_id).val();
        $.get("/menu/edit_course_description", {c_id: c_id, description: description}, function () {
            updateCourseDisplay();
        });
    }

        // EDIT INGREDIENTS
    function editIngredientName() {
        var i_id = $(this).prop("name");
        var i_name = $("#ingredient-edit-name_" + i_id).val();
        $.get("/menu/edit_ingredient_name", {i_id: i_id, i_name: i_name}, function () {
            updateIngredientDisplay();
            $.when(
                updateIngredients()
            ).done(function () {
                updateCourseDisplay();
                updateSelectionDisplay();
            });
        });
    }

    function editIngredientAvailable() {
        var i_id = $(this).prop("name");
        var available = $("#ingredient-edit-available_" + i_id).val();
        $.get("/menu/edit_ingredient_available", {i_id: i_id, available: available}, function () {
            updateIngredientDisplay();
            updateCourseDisplay();
        })
    }

        // EDIT ALLERGENES
    function editAllergeneName() {
        var a_id = $(this).prop("name");
        var a_name = $("#allergene-edit-name_" + a_id).val();
        $.get("/menu/edit_allergene_name", {a_id: a_id, a_name: a_name}, function () {
            updateAllergeneDisplay();
            $.when(
                updateAllergenes()
            ).done(function () {
                updateIngredientDisplay();
            });
        });
    }

        // EDIT CATEGORIES
    function editCategoryName() {
        var ca_id = $(this).prop("name");
        var ca_name = $("#category-edit-name_" + ca_id).val();
        $.get("/menu/edit_category_name", {ca_id: ca_id, ca_name: ca_name}, function () {
            updateCategoryDisplay();
            $.when(
                updateCategories()
            ).done(function () {
                updateCourseDisplay();
            });
        });
    }

        // EDIT SELECTIONS
    function editSelectionName() {
        var s_id = $(this).prop("name");
        var s_name = $("#selection-edit-name_" + s_id).val();
        $.get("/menu/edit_selection_name", {s_id: s_id, s_name: s_name}, function () {
            updateSelectionDisplay();
            $.when(
                updateSelections()
            ).done(function () {
                updateCourseDisplay();
            });
        });
    }

    function editSelectionSelectionCategory() {
        var s_id = $(this).prop("id").split("-")[1];
        var sc_id = $("#autocomplete_selection_edit_selection_category-" + s_id).prop("name");
        $.get("/menu/edit_selection_selection_category", {s_id: s_id, sc_id: sc_id}, function () {
            updateSelectionDisplay();
        });
    }

    function editSelectionIngredient() {
        var s_id = $(this).prop("id").split("-")[1];
        var i_id = parseInt($("#autocomplete_selection_edit_ingredient-" + s_id).prop("name"));

        if (i_id != i_id) {
            i_id = -1;
        }

        $.get("/menu/edit_selection_ingredient", {s_id: s_id, i_id: i_id}, function () {
            updateSelectionDisplay();
        });
    }

    function editSelectionPrice() {
        var s_id = $(this).prop("name");
        var s_price = parseFloat($("#selection-edit-price_" + s_id).val());

        if (s_price != s_price || s_price === 0.00) {
            s_price = -1;
        }

        $.get("/menu/edit_selection_price", {s_id: s_id, s_price: s_price}, function () {
            updateSelectionDisplay();
        });
    }

        // EDIT SELECTION CATEGORIES
    function editSelectionCategoryName() {
        var sc_id = $(this).prop("name");
        var sc_name = $("#selection-category-edit-name_" + sc_id).val();
        $.get("/menu/edit_selection_category_name", {sc_id: sc_id, sc_name: sc_name}, function () {
            updateSelectionCategoryDisplay();

            $.when(
                updateSelectionCategories()
            ).done(function () {
                updateSelectionDisplay();
            });
        });
    }


    // AJAX FETCHING
    function updateIngredients(promise) {
        return new Promise(resolve => {
            $.ajax({
                url: "/menu/get_ingredients",
                type: "get",
                async: true,
                success: function(data) {
                    ingredients = JSON.parse(data);
                    resolve(promise);
                }
            });
        })
    }

    function updateAllergenes(promise) {
        return new Promise(resolve => {
            $.ajax({
                url: "/menu/get_allergenes",
                type: "get",
                async: true,
                success: function(data) {
                    allergenes = JSON.parse(data);
                    resolve(promise);
                }
            });
        });
    }
    
    function updateCategories(promise) {
        return new Promise(resolve => {
            $.ajax({
                url: "/menu/get_categories",
                type: "get",
                async: true,
                success: function(data) {
                    categories = JSON.parse(data);
                    resolve(promise);
                }
            });
        });
    }

    function updateSelections(promise) {
        return new Promise(resolve => {
            $.ajax({
                url: "/menu/get_selections",
                type: "get",
                async: true,
                success: function(data) {
                    selections = JSON.parse(data);
                    resolve(promise);
                }
            });
        });
    }

    function updateSelectionCategories(promise) {
        return new Promise(resolve => {
            $.ajax({
                url: "/menu/get_selection_categories",
                type: "get",
                async: true,
                success: function(data) {
                    selectionCategories = JSON.parse(data);
                    resolve(promise);
                }
            });
        });
    }

    function updateCourseDisplay() {
        $.get("/menu/get_course_display", function (data) {
            $(".course_display").html(data);
            initCourses();
        });
    }

    function updateIngredientDisplay() {
        $.get("/menu/get_ingredient_display", function (data) {
            $(".ingredient_display").html(data);
            initIngredients();
        });
    }

    function updateAllergeneDisplay() {
        $.get("/menu/get_allergene_display", function (data) {
            $(".allergene_display").html(data);
            initAllergenes();
        });
    }

    function updateCategoryDisplay() {
        $.get("/menu/get_category_display", function (data) {
            $(".category_display").html(data);
            initCategories();
        });
    }

    function updateSelectionDisplay() {
        $.get("/menu/get_selection_display", function (data) {
            $(".selection_display").html(data);
            initSelections();
        });
    }

    function updateSelectionCategoryDisplay() {
        $.get("/menu/get_selection_category_display", function (data) {
            $(".selection_category_display").html(data);
            initSelectionCategories();
        });
    }

});

/*************************\
| MISCELLANIOUS FUNCTIONS | 
\*************************/

function setupAutocomplete(inputString, dict, nameParamater, idParameter) {
    var inputs = $(inputString);
    for (var i = 0; i < inputs.length; i++) {
        var arrayIn = [];
        for (var j = 0; j < dict.length; j++) {
            arrayIn.push({
                name: dict[j][nameParamater],
                id: dict[j][idParameter] 
            });
        }
        autocomplete(inputs[i], arrayIn);
    }
}

// GOTTEN FROM W3 SCHOOLS, BUT IT WORKS SO OKAY
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        if (darkMode) {
            a.setAttribute("id", this.id + "autocomplete-list-dark");
            a.setAttribute("class", "autocomplete-items-dark");
        } else {
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
        }
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                b.innerHTML += "<input type='hidden' value='" + arr[i].id + "'>";
                b.addEventListener("click", function(e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    inp.name = this.getElementsByTagName("input")[1].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function(e) {
        var x;
        if (darkMode) {
            x = document.getElementById(this.id + "autocomplete-list-dark");
        } else {
            x = document.getElementById(this.id + "autocomplete-list");
        }
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        if (darkMode) {
            x[currentFocus].classList.add("autocomplete-active-dark");
        } else {
            x[currentFocus].classList.add("autocomplete-active");
        }
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            if (darkMode) {
                x[i].classList.remove("autocomplete-active-dark");
            } else {
                x[i].classList.remove("autocomplete-active");
            }
        }
    }

    function closeAllLists(elmnt) {
        var x;
        if (darkMode) {
            x = document.getElementsByClassName("autocomplete-items-dark");
        } else {
            x = document.getElementsByClassName("autocomplete-items");
        }
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}
// END OF W3 SCHOOLS AUTOCOMPLETE

function setMode() {
    if (darkMode) {
        $("#dark-mode").css("display", "none");
        $("#light-mode").css("display", "inline");
        $("table").addClass("table-dark");
        $("input").addClass("bg-dark");
        $("button").addClass("bg-dark");
        $("body").css("background", "#1a1a1a");
        $("h1").css("color", "#ffffff");
        $("h2").css("color", "#ffffff");
        $("h3").css("color", "#ffffff");
        $("h4").css("color", "#ffffff");
        $("h5").css("color", "#ffffff");
        $("h6").css("color", "#ffffff");
        $(".form-control").css("color", "white");
    } else {
        $("#dark-mode").css("display", "inline");
        $("#light-mode").css("display", "none");
        $("table").removeClass("table-dark");
        $("input").removeClass("bg-dark");
        $("button").removeClass("bg-dark");
        $("body").css("background", "#ffffff");
        $("h1").css("color", "#000000");
        $("h2").css("color", "#000000");
        $("h3").css("color", "#000000");
        $("h4").css("color", "#000000");
        $("h5").css("color", "#000000");
        $("h6").css("color", "#000000");
        $(".form-control").css("color", "black");
    }
    $("#light-mode").removeClass("bg-dark");
}