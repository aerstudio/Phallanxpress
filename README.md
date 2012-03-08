# Phalanxpress: Backbone API for Wordpress
**Phalanxpress** allows you to create a backbone app using [Wordpress](http://www.wordpress.org) as back end. So you can easily create a single page wordpress.

It provides a complete set of collections and models that automatically connects to your wordpress installation.

With this plugin you can:

* Retrieve posts, attachments, pages and custom post types.
* Retrieve the categories and tags and items from all types of taxonomies.
* Retrieve a page content.
* Retrieve the list of pages for navigation proposals.
* Retrieve the list of authors.
* All data and metadata associated for the post: author, comments, tags, etc.

## Requisites

### Wordpress plug-in json-api

#### Plugin installation

You must have the json-api plugin installed in your wordpress.

To install it, just copy the folder `json-api` to your `plugins` folder. Usually in `wp-content` folder in your wordpress file structure.

You have to activate the plugin in your wordpress. Go to the plugins page and click on `activate`.

#### Using the plugin

This plugin is a modified version of [json-api](http://wordpress.org/extend/plugins/json-api/) plugin. Please refer to [doc page](http://wordpress.org/extend/plugins/json-api/other_notes/) for more information about how to use it.

This modified version implements custom taxonomies and custom post types. If you want to get a post corresponding to a custom taxonomy just add the parameter `taxonomy` in your url queries.

For example, to get all posts of type `portofolio_project` from custom taxonomy `portfolio_category` whose `slug` is `user-experience`, the url should be:

	http://www.mywordpress.com/api/get_category_posts?slug=user-experience&taxonomy=portfolio_category&post_type=portfolio_project
	
### Javascript libraries dependencies
The only dependency is the [backbone](https://github.com/documentcloud/backbone) library and its own dependency, the [underscore](https://github.com/documentcloud/underscore) library.



## Usage

You have to include the `phallanxpress.js` or `phallanxpress.min.js` file included in the `deploy` folder. Please, always include this file after Backbone and Underscore libraries.
	
```html
<body>
...
<script src="scripts/phallanxpress.js" type="text/javascript"></script>
...
</body>
```


### Initialize
You can initialize the api just giving the url pointing to your wordpress json api. You can define this url in your json-api plugin settings page in your wordpress admin.

```javascript
phallanx = new Phallanxpress.Api('http://www.mywordpress.com/api')
```

### Posts

#### Recent posts: `recentPosts`
Returns a `Phallanxpress.Posts` instance or a view object associated with the collection containing all recent posts ordered by date:

```javascript
// Last 30 posts
phallanx.recentPosts({ view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

#### Search posts: `searchPosts`
Returns a `Phallanxpress.Posts` instance or a view object associated with the collection containing all posts matched with a search criteria
	
```javascript
// Search all posts containing key 'javascript'
phallanx.searchPosts('javascript', {view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

#### Date posts: `datePosts`
Returns a `Phallanxpress.Posts` instance or a view object associated with the collection containing all posts published on a given date
	
```javascript
// Search all posts published on March, 7th 2012
phallanx.datePosts('2012-03-07', {view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);


#### Single post: `post`
Returns a `Phallanxpress.Post` instance or a view object associated with the model containing post given an `id` or a `slug`.
	
```javascript
// Retrieve a post with slug 'phallanxpress-library'
phallanx.post('phallanxpress-library', { view: App.Views.Post });
```
	
If a `view` object is passed, it returns an instance of this object passing the model as `model` variable. 

If a `view` instance is passed in the `options` object, then the model is assigned to the view and the view's `render` method is binded to `change` event.

### Categories

#### Category list: `categoryList`
Returns a `Phallanxpress.Categories` instance or a view object associated with the collection containing all the categories or all items for a given taxonomy.
	
```javascript
// Retrieve a list of all categories from taxonomy 'project_category'
phallanx.categoryList({ taxonomy: 'project_category', view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

#### Category posts: `categoryPosts`
Returns a `Phallanxpress.Posts` instance or a view object associated with the collection containing the posts from a given category `id` or category `slug`.

```javascript	
// Posts from category with id 7
phallanx.categoryPosts(7, { view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);
### Pages

#### Page list: `pageList`
Returns a `Phallanxpress.Categories` instance or a view object associated with the collection containing all the pages.
	
```javascript
// Search all posts published on March, 7th 2012
phallanx.pagesList({ view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

#### Single page: `page`
Returns a `Phallanxpress.Page` instance or a view object associated with the model containing a page with a given `id` or `slug`.
	
```javascript
// Retrieve a page with slug 'about-us'
phallanx.page('about-us', { view: App.Views.Page });
```
	
If a `view` object is passed, it returns an instance of this object passing the model as `model` variable. 

If a `view` instance is passed in the `options` object, then the model is assigned to the view and the view's `render` method is binded to `change` event.

### Tags

#### Tag list: `tagList`
Returns a `Phallanxpress.Tags` instance or a view object associated with the collection containing all the tags or all items for a given taxonomy.
	
```javascript
// Retrieve a list of all tags
phallanx.tagList({ view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

#### Tag posts: `tagPosts`
Returns a `Phallanxpress.Posts` instance or a view object associated with the collection containing the posts from a given category `id` or category `slug`.
	
```javascript
// Posts from tag with slug 'backbone'
phallanx.tagPosts('backbone', { view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

### Author
#### Author list: `authorList`
Returns a `Phallanxpress.Authors` instance or a view object associated with the collection containing all the tags or all items for a given taxonomy.
	
```javascript
// Retrieve a list of all authors
phallanx.authorList({ view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

#### Author posts: `authorPosts`
Returns a `Phallanxpress.Posts` instance or a view object associated with the collection containing the posts from a given author.
	
```javascript
// Posts from author with id 1
phallanx.authorPosts(1, { view: App.Views.Collection });
```
	
If a `view` object is passed, it returns an instance of this object passing the collection as `collection` variable. 

If a `view` instance is passed in the `options` object, then the collection is assigned to the view and the view's `render` method is binded to `reset` and `add` events (fired when request is finished);

### Structure

You can use the api that automatically returns the objects or use the structure stand alone according to your needs.


#### Models
These are the existing models. 

* **Post**: `Phallanxpress.Post`
* **Page**: `Phallanxpress.Page`
* **Category**: `Phallanxpress.Category`
* **Tag**: `Phallanxpress.Tag`
* **Base model**: `Phallanxpress.Model`. If you want to make your own model please extend from this object. Set the `apiCommand` and `parseTag` parameter.

All models can be retrieved using `fetch()` method given an `id` or an `slug`.

If you want to make your own models based on custom post types or custom taxonomies, you can add the variable `postType` and/or `taxonomy`.


#### Collections
All the collections extends from `Phallanxpress.Collection` object.
They implement the method:

* `getBySlug(slug)`: Returns the model associated with the given slug. Returns `null` if not found or throws an error if more than one are found.


##### Posts: `Phallanxpress.Posts`
Implements the methods `recentPosts`, `searchPosts`, `datePosts`, `categoryPosts`, `tagPosts`, `authorPosts`.

Implements a pagination:

```javascript
posts = new Phallanxpress.Posts();
posts.recentPosts()
posts.on('reset', function(){
	posts.page; // Current page
	posts.pages; // Total number of pages
	posts.count; // Number of posts per page
	posts.pageUp(); // Get the next page
	posts.pageDown(); // Get the previous page
	posts.page(3, options); // Go to page 3
})
```

You can always pass an object with different options and this will be passed to the `fetch` method. For example, to make and infinite scroll:

```javascript
posts.pageUp({add: true}); 
```

This will add the new results to the previous results and a `add` event will be triggered.

If the passed contains a `params` object this will be the parametes for the api query. For example, to get the custom fields of the posts:

```javascript
posts.pageUp({ params: { custom_fields: 'city, street' } });
```
###### Events
If no results are found it triggers a `no posts` event.

In case of an error an `error` event is triggered.
		
##### Pages: `Phallanxpress.Pages`
Implements the method `pagesList`.

##### Categories: `Phallanxpress.Categories`
Implements the method `categoriesList`.

Implements a method `topCategories` that returns a new category collection with the categories with no parent item in the collection.

##### Tags: `Phallanxpress.Tags`
Implements the method `tagsList`.

##### Authors: `Phallanxpress.Authors`
Implements the method `authorsList`.


##### Base collection: `Phallanxpress.Collection`. 
If you want to make your own model please extend from this object. Set the `apiCommand` and `parseTag` parameter.



## To do whislist
These are the next steps in development (in not specific order):

* Make it work with creation controller of plugin.
* Use a cache with localStorage through `Api` object.

## Changelog

### 0.1.0
Initial release of phallanxpress.js



## How to contribute

### Forking the project
You can fork the repository, make your contribution to the code and asking for a merge request.

#### Develop
All source files are in the folder `src`. Coffeescript is used and a classical class structure is followed.
You can run this command in your terminal from the respository root folder:
	
```bash
$ cake watch
```

And your coffee files will be automatically compiled to `deploy` folder everytime they change.

If you add some files to the library, you should add it to the `output` array in the `Cakefile` file. The order must be considered.


#### Build
To build the library you have to run the next command in your terminal from the repository root folder:

```bash
$ cake build
```
	
This will create to files in the `deploy` folder: `phallanxpress.js`, the all-in-one-file development library; and `phallaxpress.min.js`, the minified and compressed version of the library.

#### Tests
The [Jasmine](http://pivotal.github.com/jasmine/) suite is used for running spec tests for BDD.

To run the tests, just drag and drop the file `index.html` in the `tests` folder to your browser.

The tests and specs are in the `specs` folder. Specs are written in Coffeescript. Run in your terminal:

```bash
$ cake test
```

To automatically compile coffeescript files.

For more info about how to use Jasmine, please go to the [Jasmine wiki](https://github.com/pivotal/jasmine/wiki).

### Issues and feature requests
Open an [issue](https://github.com/aerstudio/Phallanxpress/issues) if you find a bug or if you miss something you want to be implemented or any suggestion you want to make.

### Showing your work
If you develop something using this library, please let us know so we can make a showcase.

Send us the url of your work with some info about it to: [info@aerstudio.com](mailto:info@aerstudio.com).

Anyway, thanks!


## Thanks
We would like to thank to:

* [Wordpress.org](http://wordpress.org): You know why.
* [dphiffer](http://profiles.wordpress.org/dphiffer/): Creator of the well designed json-api wordpress plugin.
* [Jeremy Ashkenas](https://github.com/jashkenas): The name under backbone.js and coffeescript.

## License

Copyright (c) 2012 Hector Sanchez-Pajares, Aer Studio

http://www.aerstudio.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
