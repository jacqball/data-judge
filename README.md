# Data Judge - a simple jquery validation plugin

## Synopsis

Data Judge is a simple jquery validation plugin that makes use of html data attributes to define validation rules and provide feedback for the end user.Data Judge is designed to be simple to use, simple to customize and reasonably simple to extend.

## Basic Usage

To use Data Judge, you must do the following

+ include jquery and the plugin


    <!-- load jquery and data-judge wherever they are -->
    <script src="jquery.min.js" ></script>
    <script src="data-judge.js" ></script>

+ tell the plugin which form(s) to validate


    //validate forms on submit
    $(document).ready(function(){
        $('form').judge({});
    });

+ define data attributes on form element(s) to be validated


    <input id="req" name="req" type="text" data-judge-required />

That's the basic usage, but you can do much more:

+ use other validation types
+ change the name of the plugin and the data attributes in case of conlicts
+ customize error messages for validation types and specific elements
+ extend the plugin with your own validations (well not yet, but soon...)

# Built-in Validation Types

Data Judge includes the following built-in validations:

## Required

    data-judge-required

Adding this element to a form element marks that element as required    

    <input id="req" name="req" type="text" data-judge-required />

## And

    data-judge-and="other_element_name"
    data-judge-and="element1|element2"

Specify the name or names (separated by the pipe character | ) for elements required along with the marked element.
    
    Meat (required for pudding)
    <input type="text" name="meat" />
    Pudding (only with meat)
    <input type="text" data-judge-and="meat" data-judge-and-hint="How can you have any pudding if you don't eat your meat?"/>

In the above example, Meat is optional, but must be supplied if pudding is supplied. We've also overriden the generic validation message with *data-judge-and-hint* to provide a more relevant explanation.

## Or

```html
data-judge-or="other_element_name"
data-judge-or="element1|element2"
```

When at least one or the other element must be supplied.

    Contact
    Phone
    <input id="req" name="phone" type="text" data-judge-or="email" />
    Email
    <input id="req" name="email" type="text" />

As long as we have one of these, we can contact the submitter. Notice that we only have to add the *data-judge-or* attribute to one of the elements.

## Regular Expression


Regex .com

    data-judge-regex="regular expression"

Regular expressions allow flexible validation.

    Something that ends in .com
    <input type="text" data-judge-regex="\.com$"/>

Yes this is a silly contrived example.

*NOTE:* some regular expressions may require extra escaping in this context.

## Case Insensitive Regular Expression

    data-judge-regexi="regular expression"

This works exactly the same as the case sensitive variety

# Beyond the Basics

## Hints - Custom Messages

You can customize the messages displayed when validation fails using "hints". This can be done by:

1.  passing custom hint per validation class to the plugin when initialized
1.  adding a hint attribute directly to an individual element
1.  All the above can be combined as desired

### Custom Hints at Initialization

    $(document).ready(function(){
        $('form').judge({regex_hint:'That looks weird!'});
    });

This overrides the default message for all validations of the given type. This can be done for as many of the validation types as desired.

*NOTE:* The usage here is a little "briefer" since we don't have to provide the data element prefix (usually "data-judge-").

### Custom Hint Per Element

This is the simplest and most specific way of providing custom validation messages. 

    Year
    <input type="text" data-judge-regex-hint="must be a 4 digit year" data-judge-regex="^\d\d\d\d$"/>

## Validations Can Be Combined

You can combine validations for more control. As many as you like may be applied to a given element.

```html
Year
<input type="text" data-judge-required data-judge-regex="^\d\d\d\d$"/>
```

## If you need to change the name of the plugin

If the name data-judge or attributes beginning with "data-judge" conflict with something else you're using, the name can be changed at initialization.

    $(document).ready(function(){
        $('form').judge({iam:'hammer'});
    });

In this example, the plugin's name is changed to "hammer". Using the plugin would work exactly as before except that all the data elements would be prefixed "data-hammer" instead of "data-judge".

