# brightcontext-cli

A command line interface to [brightcontext](http://brightcontext.com)

# Installation

    # install the "bcc" command globaly
    npm install -g brightcontext-cli


# Usage

STDIN -> BrightContext
    
    # to a ThruChannel using default subchannel
    cat package.json | bcc --apikey=$bcc_api_key --project=$bcc_project_name  --inputchannel=$bcc_input_channel_name
  
    # to a QuantChannel Input or custom ThruChannel Subchannel
    cat package.json | bcc --apikey=$bcc_api_key --project=$bcc_project_name  --inputchannel=$bcc_input_channel_name --inputname=$bcc_input_name

BrightContext -> STDOUT
    
    # from a ThruChannel on the default subchannel
    bcc --apikey=$bcc_api_key --project=$bcc_project_name  --outputchannel=$bcc_output_channel_name
  
    # from a QuantChannel Output or custom ThruChannel Subchannel
    bcc --apikey=$bcc_api_key --project=$bcc_project_name  --outputchannel=$bcc_output_channel_name --outputname=$bcc_output_name


Testing (STDIN -> STDOUT)

    # show what will be sent, but don't actually send it
    cat package.json | bcc --dryrun

# Limitations

- Must be valid json that will pass through node native JSON.parse()
- If any feed errors occur, the process will exit with code 13