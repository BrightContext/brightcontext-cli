# brightcontext-cli

A command line interface to [brightcontext](http://brightcontext.com)

# Installation

    # install the "bcc" and "bccql" commands globaly
    npm i -g brightcontext-cli


# Usage

STDIN -> BrightContext
    
    # to a ThruChannel using default subchannel
    cat package.json | bcc --apikey=$bcc_api_key --project=$bcc_project_name  --inputchannel=$bcc_input_channel_name
  
    # to a QuantChannel Input or custom ThruChannel Subchannel
    cat package.json | bcc --apikey=$bcc_api_key --project=$bcc_project_name  --inputchannel=$bcc_input_channel_name --inputname=$bcc_input_name
    
    # the json payload is tokenized by matching brackets
    # so you should not need any whitespace in between messages
    # and you can safely dump multiple files or multiple messages
    cat 1.json 2.json 3.json | bcc --apikey=$bcc_api_key --project=$bcc_project_name  --inputchannel=$bcc_input_channel_name --inputname=$bcc_input_name

BrightContext -> STDOUT
    
    # from a ThruChannel on the default subchannel
    bcc --apikey=$bcc_api_key --project=$bcc_project_name  --outputchannel=$bcc_output_channel_name
  
    # from a QuantChannel Output or custom ThruChannel Subchannel
    bcc --apikey=$bcc_api_key --project=$bcc_project_name  --outputchannel=$bcc_output_channel_name --outputname=$bcc_output_name


Testing (STDIN -> STDOUT)

    # show what will be sent, but don't actually send it
    cat package.json | bcc --dryrun

Data Store Queries

    # latest history
    bccql --apikey $bcc_api_key \
        --project $bcc_project_name \
        --datastore $bcc_datastore_name
    
    # older history
    bccql --apikey $bcc_api_key --project $bcc_project_name \
        --datastore $bcc_datastore_name \
        --query.sinceTS `node -e 'console.log(Date.now() - 7.2e6)'` \
        --query.limit 10

    # history with filter
    bccql --apikey $bcc_api_key --project $bcc_project_name \
        --datastore $bcc_datastore_name \
        --query.sinceTS `node -e 'console.log(Date.now() - 7.2e6)'` \
        --query.limit 10 \
        --query.filters.paramname $param1value
    
    # custom
    bccql --apikey $bcc_api_key \
        --project $bcc_project_name \
        --datastore $bcc_datastore_name \
        --query.queryName 'rollupInRange' \
        --query.queryParams.start=`node -e 'console.log(Date.now() - 7.2e6)'` \
        --query.queryParams.end=`node -e 'console.log(Date.now())'` \
        --query.queryParams.timewindow=60000

# Limitations

- Must be valid json that will pass through node native JSON.parse()
- If any feed errors occur, the process will exit with code 13


