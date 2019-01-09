<?php

/*
Plugin Name: Sleeping Tracker
Description: Keeps track of al the night sleeps that have been added
Author: Brian Verschoore
*/


/**
 *  
 * Alles voor de sleep
 * 
 */
//registreer slaap als post type
function briavers_register_sleep(){
    $labels = array(
      'name' => __('Sleep', 'briavers'),
      'singular_name' => __('Sleep', 'briavers'),
      'add_new' => __('Register new sleep', 'briavers'),
      'all_items' => __('All sleep', 'briavers'),
      'add_new_item' => __('Register new sleep', 'briavers'),
      'edit_item' => __('Edit sleep', 'briavers'),
      'new_item' => __('New sleep', 'briavers'),
      'view_item' => __('View Sleep', 'briavers'),
      'search_item' => __('Search Sleep', 'briavers'),
      'not_found' => __('Sleep not found', 'briavers'),
      'not_found_in_trash' => __('Sleep not found in trash', 'briavers'),
      'parent_item_colon ' => __('Add new sleep', 'briavers'),
    );
    $arg = array(
      'labels' => $labels,
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'publicly_var' => true,
      'rewrite' => array('slug'=> 'sleep'),
      'capabilty_type' => 'post',
      'hierachical' => false,
      'supports' => array(
       // 'custom-fields'

      ),
      'menu_position' => 5,
      'exclude_from_search' => false,
      'show_in_rest' => true,
      'rest_base'=>'rest_sleep',
      'menu_icon' => 'dashicons-clock'

    );

    register_post_type('sleep', $arg);
  }
  add_action('init', 'briavers_register_sleep');

  //haal de tittel en de body velden weg aangezien dit niet nodig is voor een slaap
  function briavers_remove_post_type_support() {
    // remove_post_type_support( 'sleep', 'title' );
      remove_post_type_support( 'sleep', 'editor' );
  }
add_action( 'init', 'briavers_remove_post_type_support' );




/**
 * CREATE CUSTOM FIELDS
 */
function briavers_add_sleep_box(){
  //op welk scherm komt de meta box
  $screens = array('sleep');

  foreach ($screens as $screen ) {
    add_meta_box('sleep_box', __('the needed information', 'briavers'),'briavers_sleep_box_callback', $screen);
  }
}
function briavers_sleep_box_callback($post){
  
  //add invisiable field to check data
  wp_nonce_field('sleep_save_meta_box_data', 'sleep_meta_box_nonce');

  $bedTime = get_post_meta($post -> ID, '_bed_time', true);
  echo '<label for="bed_time">'.__('Bed Tijd','briavers') . '</label>';
  echo '<input style="width:100%; margin:0"; type="time" id="bed_time" name="bed_time" value="' . $bedTime .'">';

  $wakeTime = get_post_meta($post -> ID, '_wake_time', true);
  echo '<label for="wake_time">'.__('Wakker geworden om','briavers') . '</label>';
  echo '<input style="width:100%; margin:0"; type="time" id="wake_time" name="wake_time" value="' . $wakeTime .'">';

  $sleepDepth = get_post_meta($post -> ID, '_sleep_depth', true);
  echo '<label for="sleep_depth">'.__('Diepte van slaap','briavers') . '</label>';
  echo '<input style="width:100%; margin:0"; type="range" min="0" max="5" step="1" id="sleep_depth" name="sleep_depth" value="' . $sleepDepth .'">';
 
  $sleptOut = get_post_meta($post -> ID, '_slept_out', true);
  echo '<label for="slept_out">'.__('Hoe goed uitgeslapen ben je','briavers') . '</label>';
  echo '<input style="width:100%; margin:0"; type="range" min="0" max="5" step="1" id="slept_out" name="slept_out" value="' . $sleptOut .'">';
 
  $sleepDate = get_post_meta($post -> ID, '_sleep_date', true);
  echo '<label for="sleep_date">'.__('welke avond begon je slaap (de datum van de bed tijd)','briavers') . '</label>';
  echo '<input style="width:100%; margin:0"; type="date" id="sleep_date" name="sleep_date" value="' . $sleepDate .'">';

 
  
} 

add_action('add_meta_boxes', 'briavers_add_sleep_box');



//save the custom fields 

add_action('save_post', 'briavers_save_sleep_data');

function briavers_save_sleep_data($postid){
   if (count($_POST) === 0){
  $rest_json = file_get_contents("php://input");
  $_POST = json_decode($rest_json, true);
  }

  if( !isset($_POST['sleep_meta_box_nonce'])) {return;}
  if( defined ('DOING_AUTOSVE') && DOING_AUTOSAVE ) {return;}


  $bedTime = sanitize_text_field($_POST['bed_time']);
  $wakeTime = sanitize_text_field($_POST['wake_time']);
  $sleepDepth = sanitize_text_field($_POST['sleep_depth']);
  $sleptOut = sanitize_text_field($_POST['slept_out']);
  $sleepDate = sanitize_text_field($_POST['sleep_date']); 

  update_post_meta($postid, '_bed_time', $bedTime);
  update_post_meta($postid, '_wake_time', $wakeTime);
  update_post_meta($postid, '_sleep_depth', $sleepDepth);
  update_post_meta($postid, '_slept_out', $sleptOut);
  update_post_meta($postid, '_sleep_date', $sleepDate);

  //create a unique title 
  $dt = new DateTime("now", new DateTimeZone('Europe/Brussels'));
  $dateTime =  $dt->format('m/d/Y, H:i:s');
  $postinfo = array(
      'ID'           => $postid,
      'post_title'   => $dateTime . ' ' . $postid,
      'post_status'  => 'publish'
  );
  remove_action('save_post', 'briavers_save_sleep_data');
  wp_update_post($postinfo);
  add_action('save_post', 'briavers_save_sleep_data');

}




//create a function so the custum meta fields are pulled with the API 
register_rest_field( 'sleep', 'metadata', array(
    'get_callback' => function ( $data ) {
        return get_post_meta( $data['id'], '', '' );
    }, 
  ));





/**
 * CREATE CUSTOM COLUMNS IN THE ADMIN PANEL
 */
//add some columns in the admin list view 
add_filter( 'manage_sleep_posts_columns', 'set_custom_edit_sleep_columns' );

function set_custom_edit_sleep_columns($columns) {
    
    $columns['post_author'] = __( 'Author', 'sleep-traking' );
    $columns['sleep_time'] = __( 'Bed Time', 'sleep-traking' );
    $columns['wake_time'] = __( 'Wake Time', 'sleep-traking' );
    $columns['sleep_amount'] = __( 'Time Slept', 'sleep-traking' );
   
    return $columns;
}

// Add the data to the custom columns for the sleep post type:
add_action( 'manage_sleep_posts_custom_column' , 'custom_sleep_column', 10, 2 );
function custom_sleep_column( $column, $post_id ) {
    switch ( $column ) {

        case 'post_author' :
            echo get_the_author_meta( 'ID' );
            break;
        case 'sleep_time' :
          $bed_time = get_post_meta($post_id, '_bed_time', true);
          echo $bed_time ;
          break;
        case 'wake_time' :
          $wake_time = get_post_meta($post_id, '_wake_time', true);
          echo $wake_time ;
          break;
        case 'sleep_amount' :
          $wake_time = get_post_meta($post_id, '_wake_time', true);
          $bed_time = get_post_meta($post_id, '_bed_time', true);
          $wakeNumber = strtotime($wake_time);
          $bedNumber = strtotime($bed_time);
        
          echo(date('H:i', $wakeNumber-$bedNumber));
          break;


    }
}





/**
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 */



/**
 *  
 * Alles voor tips and tools
 * 
 */
//registreer tip and tools als post type
  function briavers_register_tips_and_tools(){
    $labels = array(
      'name' => __('Tips and Tools', 'briavers'),
      'singular_name' => __('Tips and Tools', 'briavers'),
      'add_new' => __('Register new Tips and Tool', 'briavers'),
      'all_items' => __('All Tips and Tools', 'briavers'),
      'add_new_item' => __('Register new Tips and Tool', 'briavers'),
      'edit_item' => __('Edit Tips and Tool', 'briavers'),
      'new_item' => __('New Tips and Tool', 'briavers'),
      'view_item' => __('View Tips and Tool', 'briavers'),
      'search_item' => __('Search Tips and Tool', 'briavers'),
      'not_found' => __('Tips and Tools not found', 'briavers'),
      'not_found_in_trash' => __('Tips and Tools not found in trash', 'briavers'),
      'parent_item_colon ' => __('Add new Tips and Tool', 'briavers'),
    );
    $arg = array(
      'labels' => $labels,
      'public' => true,
      'has_archive' => true,
      'publicly_queryable' => true,
      'publicly_var' => true,
      'rewrite' => array('slug'=> 'tipAndTool'),
      'capabilty_type' => 'post',
      'hierachical' => false,
      'supports' => array(
        'title',
        'editor',
        'excerpt',
        'thumbnail',
        'revision',
      //  'custom-fields'

      ),
      'taxonomies' =>array(
        'Type', 
      ),

      'menu_position' => 5,
      'exclude_from_search' => false,
      'show_in_rest' => true,
      'rest_base'=>'tipsAndTools',
      'menu_icon' => 'dashicons-warning'

    );

    register_post_type('tips_and_tools', $arg);
  }
  add_action('init', 'briavers_register_tips_and_tools');



  
  //add new taxonomy non - hierarchical
function briavers_register_tips_and_tricks_taxonomies(){
  $labels = array(
    'name' => 'Types',
    'singular_name' => 'Type',
    'search_items' => 'Search type',
    'all_items' => 'All types',
    'edit_item' => 'Edit type',
    'update_item' => 'Update type',
    'add_new_item' => 'Add New type',
    'new_item_name' => ' New type name',
    'menu_name' => 'Types',
    'not_found' => __('Types not found', 'briavers'),
    'not_found_in_trash' => __('Type not found in trash', 'briavers'),
  );
  $args = array(
    'hierarchical' => false,
    'labels' => $labels,
    'show_ui' => true,
    'show_admin_column' => true,
    'query_var' => true,
    'rewrite' => array( 'slug' => 'type'),
    'show_in_rest'       => true,
    'rest_base'          => 'type',

  );

  register_taxonomy('type', array('tips_and_tools'), $args);
}

add_action('init', 'briavers_register_tips_and_tricks_taxonomies');


/**
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 * ********************************************************************************************************************************************************
 */


 
/**
 *  
 * Alles voor image contest
 */
//registreer tip and tools als post type
function briavers_register_image_contest(){
  $labels = array(
    'name' => __('Image Contest', 'briavers'),
    'singular_name' => __('Image Contest', 'briavers'),
    'add_new' => __('Register new image for the contest', 'briavers'),
    'all_items' => __('All images for the contest', 'briavers'),
    'add_new_item' => __('Register new image for the contest', 'briavers'),
    'edit_item' => __('Edit image', 'briavers'),
    'new_item' => __('New image', 'briavers'),
    'view_item' => __('View image', 'briavers'),
    'search_item' => __('Search image', 'briavers'),
    'not_found' => __('Images for the contest not found', 'briavers'),
    'not_found_in_trash' => __('Images for the contest not found in trash', 'briavers'),
    'parent_item_colon ' => __('Add new image for the contest', 'briavers'),
  );
  $arg = array(
    'labels' => $labels,
    'public' => true,
    'has_archive' => true,
    'publicly_queryable' => true,
    'publicly_var' => true,
    'rewrite' => array('slug'=> 'imageContest'),
    'capabilty_type' => 'post',
    'hierachical' => false,
    'supports' => array(
      'title',
      'thumbnail',
    //  'custom-fields'
    ),

    'menu_position' => 5,
    'exclude_from_search' => false,
    'show_in_rest' => true,
    'rest_base'=>'imageContest',
    'menu_icon' => 'dashicons-format-image'

  );

  register_post_type('image_contest', $arg);
}
add_action('init', 'briavers_register_image_contest');

   //haal de tittel en de body velden weg aangezien dit niet nodig is voor een slaap
function briavers_remove_image_type_support() {
    remove_post_type_support( 'image_contest', 'editor' );
}
add_action( 'init', 'briavers_remove_image_type_support' );





/**
 * CREATE CUSTOM FIELDS
 */
function briavers_add_image_contest_box(){
  //op welk scherm komt de meta box
  $screens = array('image_contest');

  foreach ($screens as $screen ) {
    add_meta_box('image_box', __('the needed information', 'briavers'),'briavers_image_box_callback', $screen);

  }
}


function briavers_image_box_callback($post){
  
  //add invisiable field to check data
  wp_nonce_field('image_save_meta_box_data', 'image_meta_box_nonce');
 
  $approved = get_post_meta($post -> ID, '_approved', true);
  $approved = ($approved == 'true')? 'checked' : '';

  echo '<label for="approved">'.__('is the picture allowed? ','briavers') . '</label>';
  echo '<input style="width:15px; height:15px; margin:0"; type="checkbox" id="approved" name="approved" value="true" ' . $approved .'> <br>';
  
  



  echo '<label for="liked_by">'.__('Geliked door? ','briavers') . '</label>';
  echo '<select name="liked_by[]" id="liked_by" multiple>';
  $blogUsers = get_users( array( 'fields' => array( 'display_name', 'id' ) ) );
  // Array of stdClass objects.
  foreach ( $blogUsers as $user ) {
    echo '<option value='. $user->id . '>' .  $user->display_name . '</option> ';
  }
  echo '</select>';
} 

add_action('add_meta_boxes', 'briavers_add_image_contest_box');



//save the custom fields 

function briavers_save_picture_data($postid){
  if( !isset($_POST['image_meta_box_nonce'])) {return;}
  if( ! wp_verify_nonce($_POST['image_meta_box_nonce'], 'image_save_meta_box_data')) {return;}
  if( defined ('DOING_AUTOSAVE') && DOING_AUTOSAVE ) {return;}
  
  if(! current_user_can ('edit_post', $post_id)) {return;}

  $approved = ( isset ($_POST['approved']))? sanitize_text_field($_POST['approved']) : 'false' ; 
  $likedBy = ( isset ($_POST['liked_by']))? $_POST['liked_by'] : 'false' ; 

  /*
  $bedTime = $_POST['bed_time'];
  $wakeTime = $_POST['wake_time'];
  $sleepDepth = $_POST['sleep_depth'];
  $sleptOut = $_POST['slept_out'];
  $sleepDate = $_POST['sleep_date'];
  */
  
  update_post_meta($postid, 'liked_by', $likedBy);
  /*
  $bedTime = $_POST['bed_time'];
  $wakeTime = $_POST['wake_time'];
  $sleepDepth = $_POST['sleep_depth'];
  $sleptOut = $_POST['slept_out'];
  $sleepDate = $_POST['sleep_date'];
  */
  if ($approved == 'true'){
    $my_post = array(
      'ID'           => $postid,
      'post_status' => 'publish',
    );


  }else{
      $my_post = array(
        'ID'           => $postid,
        'post_status' => 'pending',
      );
  }
  
  
  // Update the post into the database
  remove_action('save_post', 'briavers_save_picture_data');
  // update the post, which calls save_post again
  wp_update_post( $my_post );
  update_post_meta($postid, '_approved', $approved);
  // re-hook this function
  add_action('save_post', 'briavers_save_picture_data');

}

add_action('save_post', 'briavers_save_picture_data');

register_rest_field( 'imageContest', 'metadata', array(
    'get_callback' => function ( $data ) {
        return get_post_meta( $data['id'], '', '' );
    }, 
  ));




/**
 * CREATE CUSTOM COLUMNS IN THE ADMIN PANEL
 */
//add some columns in the admin list view 
add_filter( 'manage_image_contest_posts_columns', 'set_custom_edit_image_contest_columns' );
function set_custom_edit_image_contest_columns($columns) {
    
    $columns['post_author'] = __( 'Author', 'sleep-traking' );
    $columns['is_approved'] = __( 'Goed Gekeurd ? ', 'sleep-traking' );
    $columns['image'] = __( 'image', 'sleep-traking' );
   
    return $columns;
}



// Add the data to the custom columns for the sleep post type:
add_action( 'manage_image_contest_posts_custom_column' , 'custom_image_contest_column', 10, 2 );
function custom_image_contest_column( $column, $post_id ) {
    switch ( $column ) {

        case 'post_author' :
            echo get_the_author_meta( 'ID' );
            break;
        case 'is_approved' :
          $approved = (get_post_meta($post_id, '_approved', true) == 'true')? 'goedgekeurd'  :  'nog niet goedgekeurd';
          
          echo $approved ;
          break;
        case 'image' :
          echo get_the_post_thumbnail( $post_id, array(80, 80) );
          break;
    }
}


//make columns sortable
add_filter( 'manage_edit-image_contest_sortable_columns', 'smashing_image_contest_sortable_columns');
function smashing_image_contest_sortable_columns( $columns ) {
  $columns['is_approved'] = (get_post_meta($post_id, '_approved', true) == 'true')? 'goedgekeurd'  :  'nog niet goedgekeurd';
  return $columns;
}







//custom end points
function get_personal_sleep( $data ) {
  $lastWeekSleep = get_posts( array(
    'author' => $data['id'],
    'post_type' =>"sleep",
    'orderby' => 'date',
    'order' => 'DESC',
    'posts_per_page' => 28,

    // Using the date_query to filter posts from last week
    'date_query' => array(
        array(
            'after' => '-7 days'
        )
    )
    
  ) );
  $lastMonthSleep = get_posts( array(
    'author' => $data['id'],
    'post_type' =>"sleep",
    'orderby' => 'date',
    'order' => 'DESC',
    'posts_per_page' => 120,
    
    // Using the date_query to filter posts from last week
    'date_query' => array(
        array(
            'after' => '-31 days'
        )
    )
    

  ) );

  $lastWeekData = array();
  $lastMonthData = array();

  foreach( $lastWeekSleep as $post ) {
    $returnValue = $post;
    
    $returnValue -> metadata = get_post_meta($post->ID);
    array_push($lastWeekData, $returnValue);
    }



  foreach( $lastMonthSleep as $post ) {
    $returnValue = $post;
    
    $returnValue -> metadata = get_post_meta($post->ID);
    array_push($lastMonthData, $returnValue);
    }
 
  $finalAnswer = new \stdClass();;
  $finalAnswer -> lastWeek = $lastWeekData;
  $finalAnswer -> lastMonth = $lastMonthData;


 
   return new WP_REST_Response( $finalAnswer, 200 );
}



//custom end points
function get_personal_pics($data) {
  $posts = get_posts(array(
    'author' => $data['id'],
    'post_type' => "image_contest",
    'post_status' => array('publish', 'pending', 'trash')
  ));

  $add_featured_image = function ($post) {
    // get the featured image id

    $image_id = get_post_thumbnail_id($post);

    // add the url to the post object

    $post -> thumbnail = wp_get_attachment_url($image_id, 'full');



    if (get_post_meta($post -> ID, '_approved', true) == null){
        update_post_meta($post -> ID, '_approved', 'false');
    }
    if (get_post_meta($post -> ID, 'liked_by', true) == null){
        update_post_meta($post -> ID, 'liked_by', 'false');
    }

    $post -> approved = get_post_meta($post -> ID, '_approved', true);
    $post -> imageId = $image_id;
    $post -> likedBy = get_post_meta($post -> ID, 'liked_by', true);
    //$post->postId = get_post_meta_by_id($image_id);
    // return the modified value

    return $post;
  };

  // run the posts through the map

  $posts = array_map($add_featured_image, $posts);

  if (empty($posts)) {
    return null;
  }

  return new WP_REST_Response($posts, 200);
}




function get_friends_pics($data) {
  $newsFeed = [];

  $user_info = get_userdata($data['id']);
  $friends = get_user_meta($data['id'], 'friends', true);

  if ($friends !== "") {
    array_push($friends, $data['id']);
    $data1 = get_posts(array(
      'author__in' => $friends,
      'post_type' => "image_contest",
      'post_status' => 'publish'
    ));
  } else {
    $data1 = get_posts(array(
      'author__in' => $data['id'],
      'post_type' => "image_contest",
      'post_status' => 'publish'
    ));
  }

  $add_featured_image = function ($finalAnswer) {
    // get the featured image id

    $image_id = get_post_thumbnail_id($finalAnswer);

    // add the url to the post object

    $finalAnswer -> thumbnail = wp_get_attachment_url($image_id, 'full');

    if ($finalAnswer -> post_type == "tips_and_tools") {
      return $finalAnswer;
    } else {
      $finalAnswer -> approved = get_post_meta($finalAnswer -> ID, '_approved', true);
      $finalAnswer -> likedBy = get_post_meta($finalAnswer -> ID, 'liked_by', true);
      //$post->postId = get_post_meta_by_id($image_id);
      // return the modified value
      return $finalAnswer;
    }
  };


  // run the posts through the map

  $answer = array_map($add_featured_image, $data1);



  return new WP_REST_Response($answer, 200);
}




function get_personal_feed($data) {
  $newsFeed = [];

  $user_info = get_userdata($data['id']);
  $friends = get_user_meta($data['id'], 'friends', true);

  if ($friends !== "") {
    array_push($friends, $data['id']);
    $data1 = get_posts(array(
      'author__in' => $friends,
      'post_type' => "image_contest",
      'post_status' => 'publish'
    ));
  } else {
    $data1 = get_posts(array(
      'author__in' => $data['id'],
      'post_type' => "image_contest",
      'post_status' => 'publish'
    ));
  }
  $data2 = get_posts(array(
    'post_type' => "tips_and_tools",
    'post_status' => 'publish'
  ));
  //Merge both arrays
  $allData = array_merge($data1, $data2);
  //Get just the IDs of all the posts found, while also dropping any duplicates
  $postIDs = array_unique(wp_list_pluck($allData, 'ID'));

  $data3 = get_posts(array(
    'post__in' => $postIDs,
    'post_status' => 'any',
    'post_type' => "any",
    'order' => 'DESC',
    'orderby' => 'date',
  ));



  $add_featured_image = function ($finalAnswer) {
    // get the featured image id
    $image_id = get_post_thumbnail_id($finalAnswer);
    // add the url to the post object
    $finalAnswer -> thumbnail = wp_get_attachment_url($image_id, 'full');
    if ($finalAnswer -> post_type == "tips_and_tools") {
      return $finalAnswer;
    } else {
      $finalAnswer -> approved = get_post_meta($finalAnswer -> ID, '_approved', true);
      $finalAnswer -> likedBy = get_post_meta($finalAnswer -> ID, 'liked_by', true);
      //$post->postId = get_post_meta_by_id($image_id);
      // return the modified value
      return $finalAnswer;
    }
  };
  // run the posts through the map
  $answer = array_map($add_featured_image, $data3);



  return new WP_REST_Response($answer, 200);
}



function get_tips_feed() {


  $data2 = get_posts(array(
    'post_type' => "tips_and_tools",
    'post_status' => 'publish'
  ));

  //Merge both arrays
  $allData = $data2;

  //Get just the IDs of all the posts found, while also dropping any duplicates
  $postIDs = array_unique(wp_list_pluck($allData, 'ID'));


  $data3 = get_posts(array(
    'post__in' => $postIDs,
    'post_status' => 'any',
    'post_type' => "any",
    'order' => 'DESC',
    'orderby' => 'date',
  ));



  $add_featured_image = function ($finalAnswer) {
    // get the featured image id

    $image_id = get_post_thumbnail_id($finalAnswer);

    // add the url to the post object

    $finalAnswer -> thumbnail = wp_get_attachment_url($image_id, 'full');

    return $finalAnswer;

  };


  // run the posts through the map

  $answer = array_map($add_featured_image, $data3);



  return new WP_REST_Response($answer, 200);
}


function get_friends_feed($data) {
  $newsFeed = [];
  $friendsImages;
  $friends = get_user_meta($data['id'], 'friends', true);
  $pendingFriends = get_user_meta($data['id'], 'pending_friends', true);
  $friendRequests = get_user_meta($data['id'], 'friend_requests', true);
  if ($friends !== "") {
    $data1 = get_users(array(
      'include' => $friends,
      'fields' => array('ID', 'user_nicename', 'display_name', 'user_email')
      ));

    foreach ($data1 as $friend ) {
      $images = get_posts(array(
        'author__in' => $friend->ID,
        'post_type' => "image_contest",
        'post_status' => 'publish'
      ));
      $add_featured_image = function ($finalAnswer) {
        $image_id = get_post_thumbnail_id($finalAnswer);
        $finalAnswer -> thumbnail = wp_get_attachment_url($image_id, 'full');
        $finalAnswer -> likedBy = get_post_meta($finalAnswer -> ID, 'liked_by', true);
        return $finalAnswer;
      };

      $answer = array_map($add_featured_image, $images);
  

      $friend->school = get_field('school', 'user_'.$friend->ID);
      $friend->bio = get_field('bio', 'user_'.$friend->ID);
      $friend->home_lat = get_field('home_lat', 'user_'.$friend->ID);
      $friend->home_long = get_field('home_long', 'user_'.$friend->ID);
      $friend->thumbnail = get_avatar_url( $friend->ID );
      $friend->images = $answer;
      $friend->profilePicture = wp_get_attachment_url(get_field('profile_picture', 'user_' . $friend->ID,true ));
      $friend->profilePictureId = get_field('profile_picture', 'user_' . $pendingFriend->ID,true );



    }
  }

  if ($pendingFriends !== "") {
    $data2 = get_users(array(
      'include' => $pendingFriends,
      'fields' => array('ID', 'user_nicename', 'display_name', 'user_email')
      ));
    foreach ($data2 as $pendingFriend ) {
      $pendingFriend->school = get_field('school', 'user_'.$pendingFriend->ID);
      $pendingFriend->bio = get_field('bio', 'user_'.$pendingFriend->ID);
      $pendingFriend->home_lat = get_field('home_lat', 'user_'.$pendingFriend->ID);
      $pendingFriend->home_long = get_field('home_long', 'user_'.$pendingFriend->ID);
      $pendingFriend->thumbnail = get_avatar_url( $friend->ID );
      $pendingFriend->profilePicture = wp_get_attachment_url(get_field('profile_picture', 'user_' . $pendingFriend->ID,true ));
      $pendingFriend->profilePictureId = get_field('profile_picture', 'user_' . $pendingFriend->ID,true );
      
    }
  }

  if ($friendRequests !== "") {
    $data3 = get_users(array(
      'include' => $friendRequests,
      'fields' => array('ID', 'user_nicename', 'display_name', 'user_email')
      ));
    foreach ($data3 as $friendRequests ) {
      $friendRequests->school = get_field('school', 'user_'.$friendRequests->ID);
      $friendRequests->bio = get_field('bio', 'user_'.$friendRequests->ID);
      $friendRequests->home_lat = get_field('home_lat', 'user_'.$friendRequests->ID);
      $friendRequests->home_long = get_field('home_long', 'user_'.$friendRequests->ID);
      $friendRequests->thumbnail = get_avatar_url( $friendRequests->ID );
      $friendRequests->profilePicture = wp_get_attachment_url(get_field('profile_picture', 'user_' . $friendRequests->ID ,true ));
      $friendRequests->profilePictureId = get_field('profile_picture', 'user_' . $pendingFriend->ID,true );
    }
  }


  $response = new \stdClass();
  $response -> friends = $data1;
  $response -> pendingFriends = $data2;
  $response -> friendRequests = $data3;



  return new WP_REST_Response($response, 200);
}



function put_image_like($request) {
  

  $body = $request->get_params();
  $likedBy = get_post_meta($body['imageId'], 'liked_by', true);

  if(gettype ($likedBy) !== 'array'){
      $likedBy = [$body['user']];

  } else {
      if (in_array($body['user'], $likedBy)) {

        $likedBy = array_diff($likedBy, array($body['user']));
      }else {
         array_push($likedBy, $body['user']);
      }

  }

  update_post_meta($body['imageId'], 'liked_by', $likedBy);

  $answer = get_post($body['imageId']);
  $answer_meta = get_post_meta($body['imageId']);
  $answer->meta = $answer_meta;


  return new WP_REST_Response($answer, 200);
}




function put_friend_request($request) {
  $answer = new \stdClass();
  $error = new \stdClass();
  $dataResquest = null;

  $sendingPerson = get_user_by( 'id', $request['id'] );
  $receivingPerson = get_user_by( 'email', $request['email'] );
  $type = $request['type'];
  
  $answer -> receivingPerson = $receivingPerson->data->ID;
  $answer -> sendingPerson = $sendingPerson->data->ID;
  $answer -> type = $type;


  if($receivingPerson == null){
    return new WP_REST_Response($error -> error = 'that person wasn\'t found' , 404);
  }

  if($type === "sendFriendRequest"){
    //everything for the sending end


    //get all of the senders outgoing requests
    $dataResquest = get_field('friend_requests', 'user_'. $sendingPerson->data->ID);
    $dataFriends = get_field('friends', 'user_'. $sendingPerson->data->ID);
    $finalData = array();
    if($dataResquest == false ){
      $finalData = array($receivingPerson->data->ID);      
    }else{
      foreach ($dataResquest as $key) {
        if(in_array($receivingPerson->data->ID , $key)){
          return new WP_REST_Response($error -> error = 'you already sended a request to this person' , 403);
        }else{
          array_push($finalData, $key['ID']);
        }
      }
      foreach ($dataFriends as $key) {
        if(in_array($receivingPerson->data->ID , $key)){
          return new WP_REST_Response($error -> error = 'you already have this person as friend' , 403);
        }
      }
      array_push($finalData, intval($receivingPerson->data->ID) );
    }
    update_field('friend_requests',  $finalData  ,  'user_' . $sendingPerson->data->ID);
    $checkstorage = get_field('friend_requests', 'user_'. $sendingPerson->data->ID);
    


    //everything for the receiving end
    //get all of the senders outgoing requests
    $dataPending = get_field('pending_friends', 'user_'. $sendingPerson->data->ID);
    $finalDataReciever = array();
    if($dataPending == false ){
      $finalDataReciever = array($sendingPerson->data->ID);      
    }else{
      foreach ($dataPending as $key) {
        if(in_array($sendingPerson->data->ID , $key)){
            return new WP_REST_Response($error -> error = 'you already sended a request to this person' , 403);
          }else{
            array_push($finalDataReciever, $key['ID']);
          }

        //return new WP_REST_Response($finalData, 200);
        }
      array_push($finalDataReciever, intval($sendingPerson->data->ID) );
    }
    update_field('pending_friends',  $finalDataReciever  ,  'user_' . $receivingPerson->data->ID);
    $checkstorageReceiving = get_field('pending_friends', 'user_'. $receivingPerson->data->ID);

    return new WP_REST_Response([$checkstorage, $checkstorageReceiving], 200);





  }else if($type === "acceptRequest"){
     //everything for the sending end


    //get all of the senders outgoing requests, and his friends
    $dataPending = get_field('pending_friends', 'user_'. $sendingPerson->data->ID);
    $dataFriends = get_field('friends', 'user_'. $sendingPerson->data->ID);
    $finalDataPending = array();
    $finalDataFriends= array();
    
    //this is for the friends array
    if($dataFriends == false ){
      $finalDataFriends = array($receivingPerson->data->ID);      
    }else{
      foreach ($dataFriends as $key) {
          array_push($finalDataFriends, $key['ID']);
        //return new WP_REST_Response($finalData, 200);
        }
      array_push($finalDataFriends, intval($receivingPerson->data->ID) );
    }
    update_field('friends',  $finalDataFriends  ,  'user_' . $sendingPerson->data->ID);
    






    //this is for the friend request array
    foreach ($dataPending as $key) {
      array_push($finalDataPending, $key['ID']);
    }


    $finalDataPending = array_diff($finalDataPending, array(intval($receivingPerson->data->ID)));
    if(count($finalDataPending) === 0 ){
      update_field('pending_friends',  null  ,  'user_' . $sendingPerson->data->ID);

    }else{
      update_field('pending_friends',  $finalDataPending  ,  'user_' . $sendingPerson->data->ID);

    }


    //get all of the receiver requests, and his friends
    $dataRequestsReceiver = get_field('friend_requests', 'user_'. $receivingPerson->data->ID);
    $dataFriendsReceiver  = get_field('friends', 'user_'. $receivingPerson->data->ID);

    $finaldataRequestsReceiver = array();
    $finalDataFriendsReceiver= array();
    
    //this is for the friends array
    if($dataFriendsReceiver == false ){
      $finalDataFriendsReceiver = array($sendingPerson->data->ID);      
    }else{
      foreach ($dataFriendsReceiver as $key) {
          array_push($finalDataFriendsReceiver, $key['ID']);
        //return new WP_REST_Response($finalData, 200);
        }
      array_push($finalDataFriendsReceiver, intval($sendingPerson->data->ID) );
    }
    update_field('friends',  $finalDataFriendsReceiver  ,  'user_' . $receivingPerson->data->ID);
    
    //this is for the friend request array
    foreach ($dataRequestsReceiver as $key) {
      array_push($finaldataRequestsReceiver, $key['ID']);
    }
    $finaldataRequestsReceiver = array_diff($finaldataRequestsReceiver, array(intval($sendingPerson->data->ID)));


    if(count($finaldataRequestsReceiver) === 0 ){
      update_field('friend_requests',  null  ,  'user_' . $receivingPerson->data->ID);
      
    }else{
      update_field('friend_requests',  $finaldataRequestsReceiver  ,  'user_' . $receivingPerson->data->ID);

    }
    return new WP_REST_Response([$finalDataPending, $finalDataFriends,$finalDataFriendsReceiver ,$finaldataRequestsReceiver], 201);


  }else if($type === "removeRequest"){


     //everything for the sending end


    //get all of the senders incoming requests
    $dataPending = get_field('pending_friends', 'user_'. $sendingPerson->data->ID);
    $finalDataPending = array();

    //this is for the friend request array
    foreach ($dataPending as $key) {
      array_push($finalDataPending, $key['ID']);
    }

    $finalDataPending = array_diff($finalDataPending, array(intval($receivingPerson->data->ID)));
    if(count($finalDataPending) === 0 ){
      update_field('pending_friends',  null  ,  'user_' . $sendingPerson->data->ID);
    }else{
      update_field('pending_friends',  $finalDataPending  ,  'user_' . $sendingPerson->data->ID);
    }
    //get all of the receiver requests,
    $dataRequestsReceiver = get_field('friend_requests', 'user_'. $receivingPerson->data->ID);
    $finaldataRequestsReceiver = array();
    

    //this is for the friend request array
    foreach ($dataRequestsReceiver as $key) {
      array_push($finaldataRequestsReceiver, $key['ID']);
    }
    $finaldataRequestsReceiver = array_diff($finaldataRequestsReceiver, array(intval($sendingPerson->data->ID)));


    if(count($finaldataRequestsReceiver) === 0 ){
      update_field('friend_requests',  null  ,  'user_' . $receivingPerson->data->ID);
      
    }else{
      update_field('friend_requests',  $finaldataRequestsReceiver  ,  'user_' . $receivingPerson->data->ID);

    }
    return new WP_REST_Response([$finalDataPending ,$finaldataRequestsReceiver], 201);





  }else if ($type === "removeFriendRequest"){
  



     //everything for the sending end


    //get all of the receiver incoming requests
    $dataPending = get_field('pending_friends', 'user_'. $receivingPerson->data->ID);
    $finalDataPending = array();

    //this is for the friend request array
    foreach ($dataPending as $key) {
      array_push($finalDataPending, $key['ID']);
    }

    $finalDataPending = array_diff($finalDataPending, array(intval($sendingPerson->data->ID)));
    if(count($finalDataPending) === 0 ){
      update_field('pending_friends',  null  ,  'user_' . $receivingPerson->data->ID);
    }else{
      update_field('pending_friends',  $finalDataPending  ,  'user_' . $receivingPerson->data->ID);
    }
    //get all of the sending requests,
    $dataRequestsReceiver = get_field('friend_requests', 'user_'. $sendingPerson->data->ID);
    $finaldataRequestsReceiver = array();
    

    //this is for the friend request array
    foreach ($dataRequestsReceiver as $key) {
      array_push($finaldataRequestsReceiver, $key['ID']);
    }
    $finaldataRequestsReceiver = array_diff($finaldataRequestsReceiver, array(intval($receivingPerson->data->ID)));


    if(count($finaldataRequestsReceiver) === 0 ){
      update_field('friend_requests',  null  ,  'user_' . $sendingPerson->data->ID);
      
    }else{
      update_field('friend_requests',  $finaldataRequestsReceiver  ,  'user_' . $sendingPerson->data->ID);

    }
    return new WP_REST_Response([$finalDataPending ,$finaldataRequestsReceiver], 201);





  }else if ($type === "removeFriend"){
  



     //everything for the sending end
    //get all of the senders incoming requests
    $dataFriends = get_field('friends', 'user_'. $sendingPerson->data->ID);
    $finalDataFriends = array();
    //this is for the friend request array
    foreach ($dataFriends as $key) {
      array_push($finalDataFriends, $key['ID']);
    }
    $finalDataFriends = array_diff($finalDataFriends, array(intval($receivingPerson->data->ID)));
    if(count($finalDataFriends) === 0 ){
      update_field('friends',  null  ,  'user_' . $sendingPerson->data->ID);
    }else{
      update_field('friends',  $finalDataFriends  ,  'user_' . $sendingPerson->data->ID);
    }



    //get all of the receiver requests,
    $dataFriendsReciever = get_field('friends', 'user_'. $receivingPerson->data->ID);
    $finalDataFriendsReciever = array();
    

    //this is for the friend request array
    foreach ($dataFriendsReciever as $key) {
      array_push($finalDataFriendsReciever, $key['ID']);
    }
    $finalDataFriendsReciever = array_diff($finalDataFriendsReciever, array(intval($sendingPerson->data->ID)));


    if(count($finalDataFriendsReciever) === 0 ){
      update_field('friends',  null  ,  'user_' . $receivingPerson->data->ID);
      
    }else{
      update_field('friends',  $finalDataFriendsReciever  ,  'user_' . $receivingPerson->data->ID);

    }
    return new WP_REST_Response([$finalDataPending ,$finalDataFriendsReciever], 201);
  }
  
  return new WP_REST_Response('route was not accepted', 404);
}












add_action( 'rest_api_init', 'adding_user_meta_rest' );

function adding_user_meta_rest() {
    register_rest_field( 'user',
                        'meta',
                          array(
                            'get_callback'      => 'user_meta_callback',
                            'update_callback'   => null,
                            'schema'            => null,
                            )
                      );
}
function user_meta_callback( $user, $field_name, $request) {
  $meta = new \stdClass();
  $meta -> firstName = get_user_meta( $user[ 'id' ], 'first_name', true );
  $meta -> lastName = get_user_meta( $user[ 'id' ], 'last_name', true );
  $meta -> profilePicture = wp_get_attachment_url(get_field('profile_picture','user_' . $user[ 'id' ],true ));
  $meta -> profilePictureId = get_field('profile_picture','user_' . $user[ 'id' ],true );
  return $meta;
}




add_action( 'rest_api_init', function () {
  register_rest_route( 'restSleep/v1', '/author/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_personal_sleep',

  ) );
 
 
  register_rest_route( 'restImagesMe/v1', '/author/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_personal_pics',

  ) );
 
  register_rest_route( 'restImagesFriends/v1', '/user/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_friends_pics',
   
  ) );


  register_rest_route( 'restNewsFeed/v1', '/user/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_personal_feed',

  ) );

  register_rest_route( 'restTipsFeed/v1', '/tips', array(
    'methods' => 'GET',
    'callback' => 'get_tips_feed',

  ) );
  
  register_rest_route( 'restFriends/v1', '/user/(?P<id>\d+)', array(
    'methods' => 'GET',
    'callback' => 'get_friends_feed',

  ) );
  register_rest_route( 'restLikeImage/v1', '/image', array(
    'methods' => 'POST',
    'callback' => 'put_image_like',

  ) );
  register_rest_route( 'addFriends/v1', '/user/(?P<id>\d+)', array(
    'methods' => 'POST',
    'callback' => 'put_friend_request',

  ) );



} );
